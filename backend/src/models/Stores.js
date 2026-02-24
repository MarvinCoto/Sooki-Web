import { Schema, model } from "mongoose";

const storesSchema = new Schema({
    ownerName: {
        type: String,
        required: true,
        trim: true
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
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"]
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters"]
    },
    storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Store name must be at least 2 characters"],
        maxlength: [100, "Store name cannot exceed 100 characters"]
    },
    logo: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    design: {
        type: String
        // Ver si es necesario poner un diseño default de alguna manera
    }
}, {
    timestamps: true,
    strict: false
});

export default model("Stores", storesSchema);