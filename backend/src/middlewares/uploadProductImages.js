import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const productStorage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: `stores/${req.user?.id}/products`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
        type: "upload",
    }),
});

const uploadProductImages = multer({
    storage: productStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
}).array("images", 5); // maximo 5 imagenes

export default uploadProductImages;