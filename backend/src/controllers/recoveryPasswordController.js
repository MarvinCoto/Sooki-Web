import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import clientsModel from "../models/Clients.js";
import storesModel from "../models/Stores.js";

import { sendPasswordRecoveryEmail } from "../services/emailService.js";
import { config } from "../config.js";

const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
    const { email } = req.body;

    try {
        let userFound;
        let userType;

        // Buscar primero en clientes
        userFound = await clientsModel.findOne({ email });
        if (userFound) {
            userType = "client";
        } else {
            // Si no se encuentra en clientes, buscar en tiendas
            userFound = await storesModel.findOne({ email });
            if (userFound) {
                userType = "store";
            }
        }

        if (!userFound) {
            return res.status(404).json({
                message: "No se encontró ningún usuario con este correo electrónico",
            });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const token = jsonwebtoken.sign(
            { email, code, userType, verified: false },
            config.jwt.secret,
            { expiresIn: "25m" }
        );

        res.cookie("tokenRecoveryCode", token, {
            maxAge: 25 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: undefined,
        });

        // Obtener el nombre según el tipo de usuario
        const name = userType === "client"
            ? userFound.name
            : userFound.ownerName;

        await sendPasswordRecoveryEmail(email, code, name);

        res.json({
            message: "Código de verificación enviado a tu correo electrónico",
            email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        });
    } catch (error) {
        console.error("Error in requestCode:", error);
        res.status(500).json({
            message: "Error al enviar el código de verificación",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

passwordRecoveryController.verifyCode = async (req, res) => {
    const { code } = req.body;

    try {
        const token = req.cookies.tokenRecoveryCode;

        if (!token) {
            return res.status(400).json({
                message: "No se encontró el token de recuperación. Solicita un nuevo código.",
            });
        }

        const decoded = jsonwebtoken.verify(token, config.jwt.secret);

        if (decoded.code !== code) {
            return res.status(400).json({
                message: "Código de verificación incorrecto",
            });
        }

        const newToken = jsonwebtoken.sign(
            {
                email: decoded.email,
                code: decoded.code,
                userType: decoded.userType,
                verified: true,
            },
            config.jwt.secret,
            { expiresIn: "25m" }
        );

        res.cookie("tokenRecoveryCode", newToken, {
            maxAge: 25 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: undefined,
        });

        res.json({
            message: "Código verificado correctamente. Ahora puedes cambiar tu contraseña.",
        });
    } catch (error) {
        console.error("Error in verifyCode:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "El código ha expirado. Solicita un nuevo código.",
            });
        }

        res.status(500).json({
            message: "Error al verificar el código",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

passwordRecoveryController.newPassword = async (req, res) => {
    const { password: newPassword } = req.body;

    try {
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres",
            });
        }

        const token = req.cookies.tokenRecoveryCode;

        if (!token) {
            return res.status(400).json({
                message: "No se encontró el token de recuperación",
            });
        }

        const decoded = jsonwebtoken.verify(token, config.jwt.secret);

        if (!decoded.verified) {
            return res.status(400).json({
                message: "El código no ha sido verificado",
            });
        }

        const { email } = decoded;
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        let user;

        if (decoded.userType === "client") {
            user = await clientsModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );
        } else if (decoded.userType === "store") {
            user = await storesModel.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );
        }

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.clearCookie("tokenRecoveryCode");

        res.json({
            message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
        });
    } catch (error) {
        console.error("Error in newPassword:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "El token ha expirado. Inicia el proceso de recuperación nuevamente.",
            });
        }

        res.status(500).json({
            message: "Error al actualizar la contraseña",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export default passwordRecoveryController;