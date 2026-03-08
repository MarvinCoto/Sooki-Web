// IMPORTACIONES DE DEPENDENCIAS
import clientsModel from "../models/Clients.js"        // Modelo de clientes/usuarios
import storesModel from "../models/Stores.js"          // Modelo de tiendas
import bcryptjs from "bcryptjs";                       // Librería para encriptar contraseñas
import jsonwebtoken from "jsonwebtoken";               // Librería para crear y verificar tokens JWT
import { config } from "../config.js"                  // Configuración de la aplicación

// OBJETO CONTENEDOR DE FUNCIONES DEL CONTROLADOR
const loginController = {};

// FUNCIÓN HELPER PARA VALIDAR FORMATO DE EMAIL
const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// FUNCIÓN HELPER PARA VALIDAR LONGITUD DE CONTRASEÑA
const validatePassword = (password) => {
    // Mínimo 8 caracteres requeridos
    return password && password.length >= 8;
};

// FUNCIÓN HELPER PARA VALIDAR IDs DE MONGODB
const validateObjectId = (id) => {
    // Verifica que el ID tenga el formato correcto de ObjectId (24 caracteres hexadecimales)
    return /^[0-9a-fA-F]{24}$/.test(id);
};

// FUNCIÓN PRINCIPAL DE LOGIN TRADICIONAL (EMAIL Y CONTRASEÑA)
loginController.login = async(req, res) => {
    try {
        // EXTRAER DATOS DEL CUERPO DE LA PETICIÓN
        const {email, password} = req.body;

        // VALIDACIÓN 1: CAMPOS REQUERIDOS
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email y contraseña son requeridos",
                errors: {
                    email: !email ? "Email es requerido" : null,
                    password: !password ? "Contraseña es requerida" : null
                }
            });
        }

        // VALIDACIÓN 2: TIPOS DE DATOS
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: "Email y contraseña deben ser texto válido" 
            });
        }

        // VALIDACIÓN 3: FORMATO DE EMAIL
        if (!validateEmail(email.trim())) {
            return res.status(400).json({ 
                success: false, 
                message: "El formato del email no es válido" 
            });
        }

        // VALIDACIÓN 4: LONGITUD DE CONTRASEÑA
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                success: false, 
                message: "La contraseña debe tener al menos 8 caracteres" 
            });
        }

        // VALIDACIÓN 5: LONGITUD MÁXIMA DE EMAIL
        if (email.trim().length > 254) {
            return res.status(400).json({ 
                success: false, 
                message: "El email es demasiado largo" 
            });
        }

        // VALIDACIÓN 6: LONGITUD MÁXIMA DE CONTRASEÑA
        if (password.length > 128) {
            return res.status(400).json({ 
                success: false, 
                message: "La contraseña es demasiado larga" 
            });
        }

        // LIMPIAR Y NORMALIZAR EMAIL
        const cleanEmail = email.trim().toLowerCase();

        // VARIABLES PARA ALMACENAR INFORMACIÓN DEL USUARIO ENCONTRADO
        let userFound; // Usuario encontrado en la base de datos
        let userType;  // Tipo de usuario (admin, store, client)
        let userData;  // Datos del usuario para enviar al frontend

        // NIVEL 1: VERIFICAR SI ES ADMINISTRADOR (credenciales hardcodeadas)
        if(cleanEmail === config.admin.emailAdmin && password === config.admin.password) {
            userType = "admin";
            userFound = {_id: "admin"} // ID especial para admin
            userData = {
                id: "admin",
                email: config.admin.emailAdmin,
                userType: "admin",
                name: "Administrador",
                isVerified: true // Admin siempre verificado
            }
        } else {
            // NIVEL 2: VERIFICAR SI ES UNA TIENDA
            userFound = await storesModel.findOne({email: cleanEmail});
            
            if(userFound) {
                // VALIDAR QUE LA TIENDA TENGA CONTRASEÑA EN LA BD
                if (!userFound.password) {
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error en los datos de la tienda" 
                    });
                }

                // VERIFICAR CONTRASEÑA DE LA TIENDA USANDO BCRYPT
                const isMatch = await bcryptjs.compare(password, userFound.password);
                if(!isMatch){
                    return res.status(401).json({ 
                        success: false,
                        message: "Credenciales incorrectas"
                    });
                }

                // VERIFICACIÓN ESPECIAL: COMPROBAR SI LA TIENDA ESTÁ VERIFICADA
                if (!userFound.isVerified) {
                    return res.status(403).json({ 
                        success: false, 
                        message: "Debes verificar tu correo electrónico antes de iniciar sesión.",
                        needsVerification: true,
                        email: userFound.email
                    });
                }
                
                userType = "store"
                userData = {
                    id: userFound._id,
                    email: userFound.email,
                    userType: "store",
                    ownerName: userFound.ownerName,
                    storeName: userFound.storeName,
                    username: userFound.username,
                    phoneNumber: userFound.phoneNumber,
                    logo: userFound.logo,
                    location: userFound.location || "",
                    isVerified: userFound.isVerified
                }
            } else {
                // NIVEL 3: VERIFICAR SI ES CLIENTE
                userFound = await clientsModel.findOne({email: cleanEmail});
                
                if(userFound) {
                    // VALIDAR QUE EL CLIENTE TENGA CONTRASEÑA EN LA BD
                    if (!userFound.password) {
                        return res.status(500).json({ 
                            success: false, 
                            message: "Error en los datos del cliente" 
                        });
                    }

                    // VERIFICAR CONTRASEÑA DEL CLIENTE USANDO BCRYPT
                    const isMatch = await bcryptjs.compare(password, userFound.password);
                    if(!isMatch){
                        return res.status(401).json({ 
                            success: false,
                            message: "Credenciales incorrectas"
                        });
                    }

                    // VERIFICACIÓN ESPECIAL: COMPROBAR SI EL CLIENTE ESTÁ VERIFICADO
                    if (!userFound.isVerified) {
                        return res.status(403).json({ 
                            success: false, 
                            message: "Debes verificar tu correo electrónico antes de iniciar sesión.",
                            needsVerification: true,
                            email: userFound.email
                        });
                    }
                    
                    userType = "client"
                    userData = {
                        id: userFound._id,
                        email: userFound.email,
                        userType: "client",
                        name: userFound.name || userFound.nombre || "Cliente",
                        lastname: userFound.lastname || "",
                        isVerified: userFound.isVerified,
                    }
                }
            }
        }

        // SI NO SE ENCONTRÓ NINGÚN USUARIO CON ESAS CREDENCIALES
        if(!userFound){
            return res.status(401).json({ 
                success: false,
                message: "Credenciales incorrectas"
            });
        }

        // VALIDAR QUE ESTÉ CONFIGURADO EL SECRET PARA JWT
        if (!config.jwt.secret) {
            console.error("JWT secret not configured");
            return res.status(500).json({ 
                success: false, 
                message: "Error de configuración del servidor" 
            });
        }

        // CREAR PAYLOAD PARA EL TOKEN JWT
        const tokenPayload = {
            id: userFound._id,
            userType: userType
        };

        // GENERAR TOKEN JWT DE FORMA ASÍNCRONA
        jsonwebtoken.sign(
            tokenPayload,                                    // Datos a incluir en el token
            config.jwt.secret,                              // Clave secreta para firmar
            {expiresIn: config.jwt.expiresIn || '24h'},     // Tiempo de expiración
            (error, token) => {
                // CALLBACK QUE SE EJECUTA AL GENERAR EL TOKEN
                if (error) {
                    console.error("JWT signing error:", error);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error generando token de autenticación" 
                    });
                }
                
                // CONFIGURAR COOKIE SEGURA CON EL TOKEN
                res.cookie("authToken", token, {
                    httpOnly: true,    // Solo accesible por el servidor, no por JS del cliente
                    secure: process.env.NODE_ENV === 'production',              // Solo HTTPS en producción
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Configuración CORS
                    maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
                    path: '/'          // Cookie disponible en toda la aplicación
                });
                
                // RESPUESTA EXITOSA CON DATOS DEL USUARIO Y TOKEN
                res.json({ 
                    success: true, 
                    message: "Inicio de sesión exitoso",
                    user: userData, 
                    token: token    
                });
            }
        )

    } catch (error) {
        // MANEJO DE ERRORES INESPERADOS
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor" 
        });
    }
};

// FUNCIÓN PARA VERIFICAR TOKEN EXISTENTE (VALIDAR SESIÓN ACTIVA)
loginController.verify = async (req, res) => {
    try {
        // INTENTAR OBTENER TOKEN DE COOKIES PRIMERO
        let token = req.cookies?.authToken;
        
        // SI NO HAY COOKIE, INTENTAR HEADER AUTHORIZATION
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remover "Bearer " del inicio
            }
        }

        // VALIDACIONES DEL TOKEN
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No se proporcionó token de autenticación" 
            });
        }

        if (typeof token !== 'string') {
            return res.status(401).json({ 
                success: false, 
                message: "Token de autenticación inválido" 
            });
        }

        if (token.length > 1000) {
            return res.status(401).json({ 
                success: false, 
                message: "Token demasiado largo" 
            });
        }

        // VALIDAR CONFIGURACIÓN JWT
        if (!config.jwt.secret) {
            console.error("JWT secret not configured");
            return res.status(500).json({ 
                success: false, 
                message: "Error de configuración del servidor" 
            });
        }

        // VERIFICAR Y DECODIFICAR TOKEN
        const decoded = jsonwebtoken.verify(token, config.jwt.secret);
        
        // VALIDAR CONTENIDO DEL TOKEN DECODIFICADO
        if (!decoded || !decoded.id || !decoded.userType) {
            return res.status(401).json({ 
                success: false, 
                message: "Token inválido o corrupto" 
            });
        }

        let userData;
        
        // PROCESAR SEGÚN TIPO DE USUARIO
        if (decoded.userType === "admin") {
            // USUARIO ADMINISTRADOR
            userData = {
                id: "admin",
                email: config.admin.emailAdmin,
                userType: "admin",
                name: "Administrador",
                isVerified: true
            };
        } else if (decoded.userType === "store") {
            // USUARIO TIENDA
            if (!validateObjectId(decoded.id)) {
                return res.status(401).json({ 
                    success: false, 
                    message: "ID de tienda inválido" 
                });
            }

            // BUSCAR TIENDA EN LA BASE DE DATOS
            const store = await storesModel.findById(decoded.id);
            
            if (!store) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Tienda no encontrada" 
                });
            }

            // VERIFICACIÓN ADICIONAL: TIENDA DEBE ESTAR VERIFICADA
            if (!store.isVerified) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Cuenta no verificada. Por favor verifica tu email.",
                    needsVerification: true,
                    email: store.email
                });
            }

            userData = {
                id: store._id,
                email: store.email,
                userType: "store",
                ownerName: store.ownerName,
                storeName: store.storeName,
                username: store.username,
                phoneNumber: store.phoneNumber,
                logo: store.logo,
                location: store.location || "",
                isVerified: store.isVerified
            };
        } else if (decoded.userType === "client") {
            // USUARIO CLIENTE
            if (!validateObjectId(decoded.id)) {
                return res.status(401).json({ 
                    success: false, 
                    message: "ID de cliente inválido" 
                });
            }

            // BUSCAR CLIENTE EN LA BASE DE DATOS
            const client = await clientsModel.findById(decoded.id);
            
            if (!client) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Cliente no encontrado" 
                });
            }

            // VERIFICACIÓN ADICIONAL: CLIENTE DEBE ESTAR VERIFICADO
            if (!client.isVerified) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Cuenta no verificada. Por favor verifica tu email.",
                    needsVerification: true,
                    email: client.email
                });
            }

            userData = {
                id: client._id,
                email: client.email,
                userType: "client",
                name: client.name || client.nombre || "Cliente",
                lastname: client.lastname || "",
                isVerified: client.isVerified,
            };
        } else {
            // TIPO DE USUARIO NO VÁLIDO
            return res.status(401).json({ 
                success: false, 
                message: "Tipo de usuario inválido" 
            });
        }

        // RESPUESTA EXITOSA CON DATOS DEL USUARIO
        res.json({
            success: true,
            user: userData,
            token: token
        });
        
    } catch (error) {
        console.error("Token verification error:", error);
        
        // MANEJO DE ERRORES ESPECÍFICOS DE JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "El token ha expirado" 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token inválido" 
            });
        } else if (error.name === 'NotBeforeError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token no válido aún" 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: "Error verificando token" 
        });
    }
};

// EXPORTAR EL CONTROLADOR PARA USO EN LAS RUTAS
export default loginController;