import { Schema, model } from "mongoose";

const variantAttributeSchema = new Schema({
    variantId: {
        type: Schema.Types.ObjectId,
        ref: "Variants",
        required: true
    },
    attributeId: {
        type: Schema.Types.ObjectId,
        ref: "Attributes",
        required: true
    },
    valueId: {
        type: Schema.Types.ObjectId,
        ref: "AttributeValues",
        required: true
    }
}, {
    timestamps: true
});

export default model("VariantAttributes", variantAttributeSchema);