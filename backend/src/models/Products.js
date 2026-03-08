import { Schema, model } from "mongoose";

const productSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Product name must be at least 2 characters"],
        maxlength: [200, "Product name cannot exceed 200 characters"]
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    idCategoria: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    idTienda: {
        type: Schema.Types.ObjectId,
        ref: "Stores",
        required: true
    },
    imagenes: {
        type: [String],
        default: []
    },
    precio_base: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    discount: {
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Products", productSchema);