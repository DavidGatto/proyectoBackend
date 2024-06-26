import CartModel from "../models/cart.model.js";
import mongoose from "mongoose";

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear el carrito");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("Carrito no encontrado");
        return null;
      }

      return cart;
    } catch (error) {
      console.log("Error al mostrar carrito", error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existeProducto = cart.products.find(
        (item) => item.product._id.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al agregar producto", error);
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products = updatedProducts;

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async updateQuantitiesInCart(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified("products");

        await cart.save();
        return cart;
      } else {
        throw new Error("Product not found in the cart");
      }
    } catch (error) {
      throw new Error("Error updating quantities");
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error("Cart not found");
      }
      logger.info(`Cart cleared: ${JSON.stringify(cart)}`);
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }
  async decreaseProductQuantity(cartId, productId) {
    try {
      console.log(
        `Decreasing product quantity. Cart ID: ${cartId}, Product ID: ${productId}`
      );

      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("Cart not found");
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        console.log("Product not found in the cart");
        throw new Error("Product not found in the cart");
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }

      cart.markModified("products");
      await cart.save();

      console.log("Product quantity decreased successfully");
      return cart;
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
      throw new Error("Error decreasing product quantity");
    }
  }
}

export default CartManager;
