import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Product name must be at least 2 characters"],
        maxlength: [200, "Product name cannot exceed 200 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Stores",
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    basePrice: {
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
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Products", productSchema);