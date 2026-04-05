import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
        const privateFields = ["duiFront", "duiBack", "passportPhoto", "residenceFront", "residenceBack", "selfieWithDocument"];
        const folderMap = {
            logo: "stores/logos",
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
            type: privateFields.includes(file.fieldname) ? "authenticated" : "upload",
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed"));
    },
});

export const uploadStoreImages = upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "duiFront", maxCount: 1 },
    { name: "duiBack", maxCount: 1 },
    { name: "passportPhoto", maxCount: 1 },
    { name: "residenceFront", maxCount: 1 },
    { name: "residenceBack", maxCount: 1 },
    { name: "selfieWithDocument", maxCount: 1 },
]);

export default upload;