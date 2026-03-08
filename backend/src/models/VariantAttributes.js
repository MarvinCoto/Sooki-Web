import { Schema, model } from "mongoose";

const variantAttributeSchema = new Schema({
    idVariante: {
        type: Schema.Types.ObjectId,
        ref: "Variants",
        required: true
    },
    idAtributo: {
        type: Schema.Types.ObjectId,
        ref: "Attributes",
        required: true
    },
    idValor: {
        type: Schema.Types.ObjectId,
        ref: "AttributeValues",
        required: true
    }
}, {
    timestamps: true
});

export default model("VariantAttributes", variantAttributeSchema);