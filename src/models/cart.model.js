import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  products: [productSchema],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
