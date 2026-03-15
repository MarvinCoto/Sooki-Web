import { Schema, model } from "mongoose";

const attributeValueSchema = new Schema({
    idAttribute: {
        type: Schema.Types.ObjectId,
        ref: "Attributes",
        required: true
    },
    value: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Value cannot exceed 100 characters"]
    }
}, {
    timestamps: true
});

export default model("AttributeValues", attributeValueSchema);