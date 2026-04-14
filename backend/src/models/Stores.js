import { Schema, model } from "mongoose";

const storesSchema = new Schema({

    // Referencia al propietario
    owner: {
        type: Schema.Types.ObjectId,
        ref: "StoreOwners",
        required: true
    },

    // --- Informacion publica de la tienda ---
    storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Store name must be at least 2 characters"],
        maxlength: [100, "Store name cannot exceed 100 characters"]
    },
    logo: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    design: {
        type: String,
        default: "minimalista"
    },
    colors: {
        type: [String],
        default: []
    },

    // --- About ---
    about: {
        description: { type: String, trim: true, default: "" },
        mission: { type: String, trim: true, default: "" },
        vision: { type: String, trim: true, default: "" },
        images: {
            type: [String],
            default: ["", "", ""], // [0] descripcion, [1] mision, [2] vision
            validate: {
                validator: (arr) => arr.length <= 3,
                message: "About images cannot exceed 3"
            }
        },
        isActive: {
        type: Boolean,
        default: false  // inactivo hasta que tenga contenido
    }
    },

    // --- Credenciales de acceso ---
    username: {
        type: String,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"]
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters"]
    },

    // --- Email ---
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    // --- Rol ---
    rol: {
        type: String,
        default: "shop",
        enum: ["shop"]
    },

    // --- Estado ---
    isActive: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true,
    strict: false
});

export default model("Stores", storesSchema, "stores");