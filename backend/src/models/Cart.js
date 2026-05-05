import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    idClient: {
      type: Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
      unique: true, // un carrito por cliente
    },
    items: [
      {
        idProduct: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        idStore: {
          type: Schema.Types.ObjectId,
          ref: "Stores",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "La cantidad mínima es 1"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Cart", cartSchema, "Cart");