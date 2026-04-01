import { Schema, model } from "mongoose";

const storeOwnersSchema = new Schema({

    // Referencia a la tienda
    store: {
        type: Schema.Types.ObjectId,
        ref: "Stores",
        default: null  // null hasta que el admin apruebe y se cree la tienda
    },

    // --- Informacion personal ---
    ownerName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Owner name must be at least 2 characters"],
        maxlength: [100, "Owner name cannot exceed 100 characters"]
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[\d\s\-]{7,20}$/, "Invalid phone number format"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    nit: {
        type: String,
        trim: true  // opcional
    },

    // --- Tipo y datos del documento ---
    documentType: {
        type: String,
        required: true,
        enum: ["DUI", "Pasaporte", "Residencia"]
    },

    // DUI
    duiNumber: { type: String, trim: true },        // AES encriptado
    duiFront: { type: String, trim: true },          // Cloudinary authenticated URL
    duiBack: { type: String, trim: true },           // Cloudinary authenticated URL

    // Pasaporte
    passportNumber: { type: String, trim: true },    // AES encriptado
    passportPhoto: { type: String, trim: true },     // Cloudinary authenticated URL

    // Residencia
    residenceNumber: { type: String, trim: true },   // AES encriptado
    residenceFront: { type: String, trim: true },    // Cloudinary authenticated URL
    residenceBack: { type: String, trim: true },     // Cloudinary authenticated URL

    // Selfie con documento
    selfieWithDocument: {
        type: String,
        required: true,
        trim: true                                   // Cloudinary authenticated URL
    },

    registrationIp: {
        type: String,
        trim: true                                   // AES encriptado
    },

    // --- Datos bancarios ---
    accountHolderName: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: String,                                // AES encriptado
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Ahorros", "Corriente"]
    },

    // --- Terminos aceptados ---
    acceptedTerms: { type: Boolean, required: true, default: false },
    acceptedPrivacyPolicy: { type: Boolean, required: true, default: false },
    acceptedSellerPolicy: { type: Boolean, required: true, default: false },
    acceptedProhibitedProducts: { type: Boolean, required: true, default: false },

    // --- Estado ---
    emailIsVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },  // el admin cambia esto

    // Token para setup-credentials (expira en 48h)
    credentialsToken: { type: String },
    credentialsTokenExpires: { type: Date },

}, {
    timestamps: true,
    strict: false
});

export default model("StoreOwners", storeOwnersSchema, "StoreOwners");