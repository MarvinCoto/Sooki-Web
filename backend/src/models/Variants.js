import { Schema, model } from "mongoose";

const variantSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model("Variants", variantSchema);