import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import storeModel from "../models/Stores.js";
import storeOwnerModel from "../models/StoreOwners.js";
import { sendVerificationEmail, sendPendingApprovalEmail, sendApprovalEmail } from "../services/emailService.js";
import { savePendingStore, getPendingStore, deletePendingStore } from "../utils/pendingStores.js";
import { encrypt } from "../utils/Encryption.js";
import { signStoreDocumentUrls } from "../utils/signedUrls.js";
import { config } from "../config.js";

const storeController = {};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const validateDocumentImages = (documentType, files) => {
    if (!files?.selfieWithDocument?.[0]) return "La selfie con documento es requerida";
    if (documentType === "DUI") {
        if (!files?.duiFront?.[0]) return "La foto frontal del DUI es requerida";
        if (!files?.duiBack?.[0]) return "La foto trasera del DUI es requerida";
    }
    if (documentType === "Pasaporte") {
        if (!files?.passportPhoto?.[0]) return "La foto del pasaporte es requerida";
    }
    if (documentType === "Residencia") {
        if (!files?.residenceFront?.[0]) return "La foto frontal del carnet es requerida";
        if (!files?.residenceBack?.[0]) return "La foto trasera del carnet es requerida";
    }
    return null;
};

// GET — todas las tiendas publicas 
storeController.getAllStores = async (req, res) => {
    try {
        const stores = await storeModel.find({ isActive: true })
            .select("-password -credentialsToken -credentialsTokenExpires");
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET — todas las solicitudes de propietarios (solo admin) con URLs firmadas
storeController.getAllOwners = async (req, res) => {
    try {
        const owners = await storeOwnerModel.find();
        const signedOwners = owners.map((o) => signStoreDocumentUrls(o.toObject()));
        res.status(200).json(signedOwners);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET — propietario por ID (solo admin) con URLs firmadas
storeController.getOwnerById = async (req, res) => {
    try {
        const owner = await storeOwnerModel.findById(req.params.id);
        if (!owner) return res.status(404).json({ message: "Owner not found" });
        res.status(200).json(signStoreDocumentUrls(owner.toObject()));
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /insertStore — registro inicial del emprendedor
storeController.insertStores = async (req, res) => {
    try {
        const files = req.files;
        const { documentType, duiNumber, passportNumber, residenceNumber, accountNumber, email, nit, ...rest } = req.body;

        const imageError = validateDocumentImages(documentType, files);
        if (imageError) return res.status(400).json({ message: imageError });

        // Verificar email duplicado en StoreOwners
        const existing = await storeOwnerModel.findOne({ email });
        if (existing) return res.status(400).json({ message: "This email is already registered" });

        const registrationIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";

        let documentData = {};
        if (documentType === "DUI") {
            documentData = {
                duiNumber: encrypt(duiNumber),
                duiFront: files.duiFront[0].path,
                duiBack: files.duiBack[0].path,
            };
        } else if (documentType === "Pasaporte") {
            documentData = {
                passportNumber: encrypt(passportNumber),
                passportPhoto: files.passportPhoto[0].path,
            };
        } else if (documentType === "Residencia") {
            documentData = {
                residenceNumber: encrypt(residenceNumber),
                residenceFront: files.residenceFront[0].path,
                residenceBack: files.residenceBack[0].path,
            };
        }

        const ownerData = {
            ...rest,
            email,
            documentType,
            ...documentData,
            selfieWithDocument: files.selfieWithDocument[0].path,
            accountNumber: encrypt(accountNumber),
            registrationIp: encrypt(registrationIp),
            ...(nit ? { nit } : {}),
            emailIsVerified: false,
            isVerified: false,
        };

        const code = generateCode();
        savePendingStore(email, ownerData, code);
        await sendVerificationEmail(email, rest.ownerName, code);

        res.status(200).json({ message: "Verification code sent", email });
    } catch (error) {
        res.status(500).json({ message: "Error processing registration", error: error.message });
    }
};

// POST /verifyEmail
storeController.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const pending = getPendingStore(email);
        if (!pending) return res.status(400).json({ message: "Code expired or not found. Request a new one." });
        if (pending.code !== code) return res.status(400).json({ message: "Invalid verification code" });

        // Guarda solo en StoreOwners — la tienda se crea cuando el admin aprueba
        const newOwner = new storeOwnerModel({ ...pending.ownerData, emailIsVerified: true });
        await newOwner.save();
        deletePendingStore(email);

        await sendPendingApprovalEmail(email, pending.ownerData.ownerName);
        res.status(201).json({ message: "Email verified. Your application is under review." });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

// POST /resendCode
storeController.resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const pending = getPendingStore(email);
        if (!pending) return res.status(400).json({ message: "No pending registration found for this email" });

        const newCode = generateCode();
        savePendingStore(email, pending.ownerData, newCode);
        await sendVerificationEmail(email, pending.ownerData.ownerName, newCode);

        res.status(200).json({ message: "New verification code sent" });
    } catch (error) {
        res.status(500).json({ message: "Error resending code", error: error.message });
    }
};

// POST /approveStore — solo admin
// Crea la tienda en Stores y vincula con StoreOwners
storeController.approveStore = async (req, res) => {
    try {
        const { ownerId } = req.body;

        const owner = await storeOwnerModel.findById(ownerId);
        if (!owner) return res.status(404).json({ message: "Owner not found" });
        if (owner.isVerified) return res.status(400).json({ message: "Owner is already verified" });

        const token = jwt.sign({ ownerId: owner._id }, config.jwt.secret, { expiresIn: "48h" });
        const credentialsLink = `${config.frontend?.url || "http://localhost:5173"}/setup-credentials?token=${token}`;

        owner.isVerified = true;
        owner.credentialsToken = token;
        owner.credentialsTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await owner.save();

        await sendApprovalEmail(owner.email, owner.ownerName, credentialsLink);
        res.status(200).json({ message: "Owner approved and email sent" });
    } catch (error) {
        res.status(500).json({ message: "Error approving store", error: error.message });
    }
};

// GET /setup-credentials?token=...
storeController.getSetupData = async (req, res) => {
    try {
        const { token } = req.query;
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch {
            return res.status(400).json({ message: "Link expirado o invalido. Contacta al soporte." });
        }

        const owner = await storeOwnerModel.findById(decoded.ownerId);
        if (!owner) return res.status(404).json({ message: "Owner not found" });
        if (owner.store) return res.status(400).json({ message: "Credentials already configured" });
        if (owner.credentialsToken !== token || new Date() > owner.credentialsTokenExpires) {
            return res.status(400).json({ message: "Link expirado. Contacta al soporte." });
        }

        res.status(200).json({ ownerName: owner.ownerName, email: owner.email });
    } catch (error) {
        res.status(500).json({ message: "Error fetching setup data", error: error.message });
    }
};

// POST /setup-credentials — crea la tienda y guarda credenciales
storeController.setupCredentials = async (req, res) => {
    try {
        const { token, storeName, location, design, colors, username, password } = req.body;
        const files = req.files;

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch {
            return res.status(400).json({ message: "Link expirado o invalido. Contacta al soporte." });
        }

        const owner = await storeOwnerModel.findById(decoded.ownerId);
        if (!owner) return res.status(404).json({ message: "Owner not found" });
        if (owner.store) return res.status(400).json({ message: "Credentials already configured" });
        if (owner.credentialsToken !== token || new Date() > owner.credentialsTokenExpires) {
            return res.status(400).json({ message: "Link expirado. Contacta al soporte." });
        }

        // Verificar username unico
        const existingUsername = await storeModel.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: "Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear la tienda en Stores
        const newStore = new storeModel({
            owner: owner._id,
            email: owner.email,
            storeName,
            location: location || "",
            design: design || "minimalista",
            colors: colors ? JSON.parse(colors) : [],
            username,
            password: hashedPassword,
            logo: files?.logo?.[0]?.path || "",
            rol: "shop",
            isActive: true,
        });
        await newStore.save();

        // Vincular tienda con el propietario
        owner.store = newStore._id;
        owner.credentialsToken = undefined;
        owner.credentialsTokenExpires = undefined;
        await owner.save();

        res.status(200).json({ message: "Setup completed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error setting up credentials", error: error.message });
    }
};

export default storeController;