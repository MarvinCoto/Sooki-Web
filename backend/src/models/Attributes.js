import { Schema, model } from "mongoose";

const attributeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Attribute name must be at least 2 characters"],
        maxlength: [50, "Attribute name cannot exceed 50 characters"]
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Stores",
        required: true
    }
}, {
    timestamps: true
});

export default model("Attributes", attributeSchema);