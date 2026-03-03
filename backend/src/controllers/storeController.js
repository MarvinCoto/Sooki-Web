import bcrypt from "bcryptjs";
import storeModel from "../models/Stores.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { savePendingStore, getPendingStore, deletePendingStore } from "../utils/pendingStores.js";

const storeController = {};

// Genera código de 6 dígitos
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /insertStore — recibe datos, guarda en memoria y envía correo
storeController.insertStores = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Logo image is required" });
        }

        const { password, email, ...rest } = req.body;

        // Verificar si ya existe un usuario con ese email o username
        const existing = await storeModel.findOne({
            $or: [{ email }, { username: rest.username }],
        });
        if (existing) {
            return res.status(400).json({ message: "Email or username already in use" });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const storeData = {
            ...rest,
            email,
            password: hashedPassword,
            logo: req.file.path,
            isVerified: false,
        };

        // Generar código y guardar en memoria
        const code = generateCode();
        savePendingStore(email, storeData, code);

        // Enviar correo
        await sendVerificationEmail(email, storeData.storeName, code);

        res.status(200).json({ message: "Verification code sent", email });
    } catch (error) {
        res.status(500).json({ message: "Error creating store", error: error.message });
    }
};

// POST /verifyEmail — verifica código y guarda en DB
storeController.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const pending = getPendingStore(email);
        if (!pending) {
            return res.status(400).json({ message: "Code expired or not found. Request a new one." });
        }

        if (pending.code !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Guardar en DB con isVerified: true
        const newStore = new storeModel({ ...pending.storeData, isVerified: true });
        await newStore.save();

        deletePendingStore(email);

        res.status(201).json({ message: "Store verified and created successfully", data: newStore });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

// POST /resendCode — reenvía código
storeController.resendCode = async (req, res) => {
    try {
        const { email } = req.body;

        const pending = getPendingStore(email);
        if (!pending) {
            return res.status(400).json({ message: "No pending registration found for this email" });
        }

        const newCode = generateCode();
        savePendingStore(email, pending.storeData, newCode);

        await sendVerificationEmail(email, pending.storeData.storeName, newCode);

        res.status(200).json({ message: "New verification code sent" });
    } catch (error) {
        res.status(500).json({ message: "Error resending code", error: error.message });
    }
};

export default storeController;