import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Category name must be at least 2 characters"],
        maxlength: [100, "Category name cannot exceed 100 characters"]
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Stores",
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        default: null
    }
}, {
    timestamps: true
});

export default model("Categories", categorySchema);