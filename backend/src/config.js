//importo la librería que acabo de instalar
import dotenv from "dotenv";

// Ejecuto "Dotenv"
// me ayudará a acceder al .env
dotenv.config();

export const config = {
    db: {
        URI: process.env.DB_URI || "mongodb://localhost:27017/SookiDB",
    },
    server: {
        port: process.env.PORT || 4000,
    },
};