import dotenv from "dotenv";
dotenv.config();

export const config = {
    db: {
        URI: process.env.DB_URI,
    },
    server: {
        port: process.env.PORT,
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
        api_key: process.env.API_KEY_CLOUDINARY,
        api_secret: process.env.API_SECRET_CLOUDINARY,
    }
};