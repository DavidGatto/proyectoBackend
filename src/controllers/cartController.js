const Cart = require("../models/cart.model.js");
const CartManager = require("../repositories/cart.repository.js");
const managerc = new CartManager();
const TicketModel = require("../models/ticket.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CartUtils = require("../utils/cartUtil.js");
const cartUtils = new CartUtils();
const UserModel = require("../models/user.model.js");

class CartController {
  // Ruta para crear un nuevo carrito
  async createCart(req, res) {
    try {
      const newCart = await managerc.createCart();
      res.json(newCart);
    } catch (error) {
      console.error("Error del carrito", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  // Ruta para agregar un producto a un carrito específico
  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      await cartRepository.addProductToCart(cartId, productId, quantity);
      // const cartID = req.user.cart.toString();

      res.redirect(`/api/carts/${cartId}`);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  // Ruta para eliminar un producto de un carrito específico
  async deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
      // Encontrar el carrito por su ID
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      // Obtener el array de productos del carrito
      let products = cart.products;

      // Encontrar el índice del producto que deseas eliminar dentro del array de productos
      const index = products.findIndex((item) => item.product._id === pid);
      if (index === -1) {
        return res
          .status(404)
          .json({ error: "Producto no encontrado en el carrito" });
      }

      // Eliminar el producto del array de productos
      products.splice(index, 1);

      // Guardar el carrito actualizado en la base de datos
      cart.products = products;
      await cart.save();

      // Devolver una respuesta exitosa
      return res.json({
        status: "success",
        message: "Producto eliminado del carrito correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Ruta para actualizar el carrito con un arreglo de productos
  async updateCart(req, res) {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.log("El carrito no existe");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productsWhitStringsIds = cart.products.map((product) => ({
        quantity: product.quantity,
        _id: product._id.toString(),
        title: product.product.title,
        price: product.product.price,
      }));
      res.render("carts", { cartId: cartId, products: productsWhitStringsIds });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  // Ruta para actualizar la cantidad de ejemplares de un producto en un carrito específico
  async updateProdQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cid, "products._id": pid },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Ruta para eliminar todos los productos de un carrito específico
  async emptyCart(req, res) {
    const { cid } = req.params;

    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al eliminar todos los productos del carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async completePurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);
      const products = cart.products;

      const unavailableProducts = [];

      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductById(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          unavailableProducts.push(productId);
        }
      }

      const userWithCart = await UserModel.findOne({ cart: cartId });

      const ticket = new TicketModel({
        code: cartUtils.generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: cartUtils.calculateTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      cart.products = cart.products.filter((item) =>
        unavailableProducts.some((productId) => productId.equals(item.product))
      );

      await cart.save();

      res.status(200).json({ ticket });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
