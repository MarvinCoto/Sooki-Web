import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const isStore = (req, res, next) => {
    try {
        let token = req.cookies?.authToken;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "No autorizado" });
        }

        const decoded = jsonwebtoken.verify(token, config.jwt.secret);

        if (decoded.userType !== "store") {
            return res.status(403).json({ success: false, message: "Acceso denegado. Solo tiendas pueden realizar esta accion." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token invalido o expirado" });
    }
};

export default isStore;