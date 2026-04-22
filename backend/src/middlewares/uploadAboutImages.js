import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const aboutStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: `stores/${req.user?.id}/about`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1200, height: 800, crop: "limit" }],
        type: "upload",
    }),
});

const uploadAboutImages = multer({
    storage: aboutStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed"));
    },
}).fields([
    { name: "descriptionImage", maxCount: 1 },
    { name: "missionImage", maxCount: 1 },
    { name: "visionImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
]);

export default uploadAboutImages;