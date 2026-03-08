import clientsModel from "../models/Clients.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../cloudinary.js";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import mongoose from "mongoose";
import {
    sendVerificationEmail,
    sendResendVerificationEmail,
} from "../services/emailService.js";

const registerClientsController = {};

const getCookieOptions = () => {
    return {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };
};

const validateClientData = (data) => {
    const errors = [];
    const { name, lastname, birthdate, email, password } = data;

    if (!name || name.trim() === "") {
        errors.push("El nombre es requerido");
    } else if (name.trim().length < 2) {
        errors.push("El nombre debe tener al menos 2 caracteres");
    } else if (name.trim().length > 50) {
        errors.push("El nombre no puede exceder 50 caracteres");
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
        errors.push("El nombre solo puede contener letras y espacios");
    }

    if (!lastname || lastname.trim() === "") {
        errors.push("El apellido es requerido");
    } else if (lastname.trim().length < 2) {
        errors.push("El apellido debe tener al menos 2 caracteres");
    } else if (lastname.trim().length > 50) {
        errors.push("El apellido no puede exceder 50 caracteres");
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastname.trim())) {
        errors.push("El apellido solo puede contener letras y espacios");
    }

    if (!birthdate) {
        errors.push("La fecha de nacimiento es requerida");
    } else {
        const birth = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (isNaN(birth.getTime())) {
            errors.push("La fecha de nacimiento no es válida");
        } else if (birth > today) {
            errors.push("La fecha de nacimiento no puede ser futura");
        } else if (age < 18 || (age === 18 && monthDiff < 0)) {
            errors.push("Debes ser mayor de 18 años para registrarte");
        } else if (age > 120) {
            errors.push("La fecha de nacimiento no es válida");
        }
    }

    if (!email || email.trim() === "") {
        errors.push("El email es requerido");
    } else if (email.trim().length < 4) {
        errors.push("El email debe tener al menos 4 caracteres");
    } else if (email.trim().length > 50) {
        errors.push("El email no puede exceder 50 caracteres");
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
        errors.push("Por favor proporciona un email válido");
    }

    if (!password || password.trim() === "") {
        errors.push("La contraseña es requerida");
    } else if (password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
    } else if (password.length > 128) {
        errors.push("La contraseña no puede exceder 128 caracteres");
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.push("La contraseña debe contener al menos una mayúscula, una minúscula y un número");
    }

    return errors;
};

const validateObjectId = (id, fieldName = "ID") => {
    if (!id) return `${fieldName} es requerido`;
    if (!mongoose.Types.ObjectId.isValid(id)) return `${fieldName} no es válido`;
    return null;
};

const validateImageFile = (file) => {
    if (!file) return null;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.mimetype)) return "Solo se permiten archivos de imagen (JPEG, JPG, PNG)";
    if (file.size > maxSize) return "La imagen no puede exceder 5MB";
    return null;
};

registerClientsController.registerClient = async (req, res) => {
    const { name, lastname, birthdate, email, password } = req.body;
    let imageURL = "";

    const validationErrors = validateClientData(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Errores de validación",
            errors: validationErrors,
        });
    }

    if (req.file) {
        const imageError = validateImageFile(req.file);
        if (imageError) {
            return res.status(400).json({ success: false, message: imageError });
        }
    }

    try {
        // Eliminar clientes no verificados con más de 1 día
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await clientsModel.deleteMany({
            isVerified: false,
            createdAt: { $lt: oneDayAgo },
        });

        const existingClient = await clientsModel.findOne({
            email: email.trim().toLowerCase(),
        });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un cliente registrado con este email",
            });
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "clients",
                    allowed_formats: ["png", "jpg", "jpeg"],
                    transformation: [
                        { width: 500, height: 500, crop: "limit" },
                        { quality: "auto" },
                    ],
                });
                imageURL = result.secure_url;
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Error subiendo la imagen",
                });
            }
        }

        const passwordHash = await bcryptjs.hash(password, 12);

        const clientData = {
            name: name.trim(),
            lastname: lastname.trim(),
            birthdate: new Date(birthdate),
            email: email.trim().toLowerCase(),
            password: passwordHash,
            isVerified: false,
            ...(imageURL && { photo: imageURL }),
        };

        const newClient = new clientsModel(clientData);
        await newClient.save();

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const tokenCode = jsonwebtoken.sign(
            { email: email.trim().toLowerCase(), verificationCode },
            config.jwt.secret,
            { expiresIn: "2h" }
        );

        res.cookie("VerificationToken", tokenCode, getCookieOptions());

        try {
            await sendVerificationEmail(email.trim().toLowerCase(), verificationCode, name.trim());
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Error enviando el correo de verificación",
            });
        }

        res.status(201).json({
            success: true,
            message: "Cliente registrado exitosamente. Se ha enviado un código de verificación a tu correo electrónico.",
            needsVerification: true,
            client: {
                id: newClient._id,
                name: newClient.name,
                lastname: newClient.lastname,
                birthdate: newClient.birthdate,
                email: newClient.email,
                photo: newClient.photo,
                isVerified: newClient.isVerified,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un usuario registrado con este email",
            });
        }

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: validationErrors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};

registerClientsController.verifyCodeEmail = async (req, res) => {
    try {
        const { verificationCode } = req.body;

        if (!verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Código de verificación requerido",
            });
        }

        let codeString;
        try {
            codeString = verificationCode.toString().trim();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Formato de código inválido",
            });
        }

        if (!/^\d{6}$/.test(codeString)) {
            return res.status(400).json({
                success: false,
                message: "El código de verificación debe ser de 6 dígitos",
            });
        }

        const token = req.cookies.VerificationToken;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token de verificación no encontrado o expirado",
            });
        }

        let decoded;
        try {
            decoded = jsonwebtoken.verify(token, config.jwt.secret);
        } catch (jwtError) {
            res.clearCookie("VerificationToken");
            if (jwtError.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "El código de verificación ha expirado. Solicita un nuevo código.",
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token de verificación inválido",
            });
        }

        if (!decoded?.email || !decoded?.verificationCode) {
            res.clearCookie("VerificationToken");
            return res.status(400).json({
                success: false,
                message: "Token de verificación malformado",
            });
        }

        const { email, verificationCode: storedCode } = decoded;

        if (codeString.trim() !== String(storedCode).trim()) {
            res.clearCookie("VerificationToken");
            return res.status(400).json({
                success: false,
                message: "Código de verificación inválido",
            });
        }

        const client = await clientsModel.findOne({ email });
        if (!client) {
            res.clearCookie("VerificationToken");
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado",
            });
        }

        if (client.isVerified) {
            res.clearCookie("VerificationToken");
            return res.status(400).json({
                success: false,
                message: "Este email ya está verificado",
            });
        }

        client.isVerified = true;
        await client.save();
        res.clearCookie("VerificationToken");

        return res.json({
            success: true,
            message: "Email verificado exitosamente. Ya puedes iniciar sesión.",
        });
    } catch (error) {
        try { res.clearCookie("VerificationToken"); } catch (_) {}

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Error interno del servidor",
            });
        }
    }
};

registerClientsController.resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email || email.trim() === "") {
        return res.status(400).json({ success: false, message: "Email requerido" });
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Por favor proporciona un email válido",
        });
    }

    try {
        const client = await clientsModel.findOne({ email: email.trim().toLowerCase() });

        if (!client) {
            return res.status(404).json({ success: false, message: "Cliente no encontrado" });
        }

        if (client.isVerified) {
            return res.status(400).json({ success: false, message: "Este email ya está verificado" });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const tokenCode = jsonwebtoken.sign(
            { email: email.trim().toLowerCase(), verificationCode },
            config.jwt.secret,
            { expiresIn: "2h" }
        );

        res.cookie("VerificationToken", tokenCode, getCookieOptions());

        try {
            await sendResendVerificationEmail(email.trim().toLowerCase(), verificationCode, client.name);
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Error reenviando el correo de verificación",
            });
        }

        res.json({
            success: true,
            message: "Nuevo código de verificación enviado a tu correo electrónico",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

export default registerClientsController;