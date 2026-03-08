import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js"; 

cloudinary.config({
    cloudinary_name: config.cloudinary.cloudinary_name,
    cloudinary_api_key: config.cloudinary.cloudinary_api_secret,
    cloudinary_api_secret: config.cloudinary.cloudinary_api_secret
});

export default cloudinary;