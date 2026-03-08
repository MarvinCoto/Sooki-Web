import { Schema, model } from "mongoose";

const attributeValueSchema = new Schema({
    idAtributo: {
        type: Schema.Types.ObjectId,
        ref: "Attributes",
        required: true
    },
    valor: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Value cannot exceed 100 characters"]
    }
}, {
    timestamps: true
});

export default model("AttributeValues", attributeValueSchema);