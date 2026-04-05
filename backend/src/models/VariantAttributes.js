import { Schema, model } from "mongoose";

const variantAttributeSchema = new Schema({
    idVariant: {
        type: Schema.Types.ObjectId,
        ref: "Variants",
        required: true
    },
    idAttribute: {
        type: Schema.Types.ObjectId,
        ref: "Attributes",
        required: true
    },
    idValue: {
        type: Schema.Types.ObjectId,
        ref: "AttributeValues",
        required: true
    }
}, {
    timestamps: true
});

export default model("VariantAttributes", variantAttributeSchema);