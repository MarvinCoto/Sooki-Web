import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

// Carpetas publicas — logo de la tienda
const publicStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: "stores/logos",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        type: "upload", // publico
    }),
});

// Carpetas privadas — documentos de identidad y selfies
const privateStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        const folderMap = {
            duiFront: "stores/dui",
            duiBack: "stores/dui",
            passportPhoto: "stores/passport",
            residenceFront: "stores/residence",
            residenceBack: "stores/residence",
            selfieWithDocument: "stores/selfies",
        };
        return {
            folder: folderMap[file.fieldname] || "stores/misc",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ width: 1200, height: 1200, crop: "limit" }],
            type: "authenticated", // privado — requiere URL firmada
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"));
    }
};

// Multer para logo (publico)
const uploadPublic = multer({
    storage: publicStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});

// Multer para documentos (privado)
const uploadPrivate = multer({
    storage: privateStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});

// Middleware combinado — maneja ambos tipos en una sola peticion
export const uploadStoreImages = (req, res, next) => {
    // Primero sube el logo como publico
    uploadPublic.fields([{ name: "logo", maxCount: 1 }])(req, res, (err) => {
        if (err) return next(err);

        // Luego sube los documentos como privados
        uploadPrivate.fields([
            { name: "duiFront", maxCount: 1 },
            { name: "duiBack", maxCount: 1 },
            { name: "passportPhoto", maxCount: 1 },
            { name: "residenceFront", maxCount: 1 },
            { name: "residenceBack", maxCount: 1 },
            { name: "selfieWithDocument", maxCount: 1 },
        ])(req, res, (err2) => {
            if (err2) return next(err2);
            next();
        });
    });
};

export default uploadPublic;