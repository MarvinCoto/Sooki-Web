import clientsModel from "../models/Clients.js"
import storesModel from "../models/Stores.js"
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js"

const loginController = {};

const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => password && password.length >= 8;
const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

loginController.login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email y contraseña son requeridos",
            });
        }

        if (!validateEmail(email.trim())) {
            return res.status(400).json({ success: false, message: "El formato del email no es válido" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const tokenExpiration = rememberMe ? "30d" : "24h";
        const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        let userFound;
        let userType;
        let userData;

        // Admin
        if (cleanEmail === config.admin.emailAdmin.toLowerCase() && password === config.admin.password) {
            userType = "admin";
            userFound = { _id: "admin" };
            userData = {
                id: "admin",
                email: config.admin.emailAdmin,
                userType: "admin",
                name: "Administrador",
                isVerified: true
            };
        } else {
            // Tienda — busca por email en Stores
            userFound = await storesModel.findOne({ email: cleanEmail });

            if (userFound) {
                if (!userFound.password) {
                    return res.status(500).json({ success: false, message: "Error en los datos de la tienda" });
                }

                const isMatch = await bcryptjs.compare(password, userFound.password);
                if (!isMatch) {
                    return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
                }

                if (!userFound.isActive) {
                    return res.status(403).json({ success: false, message: "Tu cuenta ha sido desactivada." });
                }

                userType = "store";
                userData = {
                    id: userFound._id,
                    email: userFound.email,
                    userType: "store",
                    storeName: userFound.storeName,
                    username: userFound.username,
                    logo: userFound.logo,
                    location: userFound.location || "",
                    rol: userFound.rol,
                };
            } else {
                // Cliente
                userFound = await clientsModel.findOne({ email: cleanEmail });

                if (userFound) {
                    if (!userFound.password) {
                        return res.status(500).json({ success: false, message: "Error en los datos del cliente" });
                    }

                    const isMatch = await bcryptjs.compare(password, userFound.password);
                    if (!isMatch) {
                        return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
                    }

                    if (!userFound.isVerified) {
                        return res.status(403).json({
                            success: false,
                            message: "Debes verificar tu correo electrónico antes de iniciar sesión.",
                            needsVerification: true,
                            email: userFound.email
                        });
                    }

                    userType = "client";
                    userData = {
                        id: userFound._id,
                        email: userFound.email,
                        userType: "client",
                        name: userFound.name || userFound.nombre || "Cliente",
                        lastname: userFound.lastname || "",
                        isVerified: userFound.isVerified,
                    };
                }
            }
        }

        if (!userFound) {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }

        const tokenPayload = { id: userFound._id, userType };

        jsonwebtoken.sign(
            tokenPayload,
            config.jwt.secret,
            { expiresIn: tokenExpiration },
            (error, token) => {
                if (error) return res.status(500).json({ success: false, message: "Error generando token" });

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: cookieMaxAge,
                    path: '/'
                });

                res.json({ success: true, message: "Inicio de sesión exitoso", user: userData, token });
            }
        );

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

loginController.verify = async (req, res) => {
    try {
        let token = req.cookies?.authToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) return res.status(401).json({ success: false, message: "No se proporcionó token" });

        const decoded = jsonwebtoken.verify(token, config.jwt.secret);
        if (!decoded || !decoded.id || !decoded.userType) {
            return res.status(401).json({ success: false, message: "Token inválido" });
        }

        let userData;

        if (decoded.userType === "admin") {
            userData = {
                id: "admin",
                email: config.admin.emailAdmin,
                userType: "admin",
                name: "Administrador",
                isVerified: true
            };
        } else if (decoded.userType === "store") {
            if (!validateObjectId(decoded.id)) return res.status(401).json({ success: false, message: "ID inválido" });

            const store = await storesModel.findById(decoded.id);
            if (!store) return res.status(404).json({ success: false, message: "Tienda no encontrada" });
            if (!store.isActive) return res.status(403).json({ success: false, message: "Cuenta desactivada" });

            userData = {
                id: store._id,
                email: store.email,
                userType: "store",
                storeName: store.storeName,
                username: store.username,
                logo: store.logo,
                location: store.location || "",
                rol: store.rol,
            };
        } else if (decoded.userType === "client") {
            if (!validateObjectId(decoded.id)) return res.status(401).json({ success: false, message: "ID inválido" });

            const client = await clientsModel.findById(decoded.id);
            if (!client) return res.status(404).json({ success: false, message: "Cliente no encontrado" });
            if (!client.isVerified) return res.status(403).json({ success: false, message: "Cuenta no verificada" });

            userData = {
                id: client._id,
                email: client.email,
                userType: "client",
                name: client.name || client.nombre || "Cliente",
                lastname: client.lastname || "",
                isVerified: client.isVerified,
            };
        } else {
            return res.status(401).json({ success: false, message: "Tipo de usuario inválido" });
        }

        res.json({ success: true, user: userData, token });

    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: "Token expirado" });
        if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: "Token inválido" });
        return res.status(500).json({ success: false, message: "Error verificando token" });
    }
};

export default loginController;