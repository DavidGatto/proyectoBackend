const Cart = require("../models/cart.model.js");
const CartManager = require("../repositories/cart.repository.js");
const managerc = new CartManager();
const UserModel = require("../models/user.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

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
      await cartRepository.agregarProducto(cartId, productId, quantity);
      const cartID = req.user.cart.toString();

      res.redirect(`/carts/${cartID}`);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  // Ruta para eliminar un producto de un carrito específico
  async deleteProdFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        cid,
        { $pull: { products: { _id: pid } } },
        { new: true }
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al eliminar producto del carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
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
        console.log("El carrito no exite");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      return res.json(cart.products);
    } catch (error) {
      res.status(500).json({ error: "Error  del servidor" });
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
}

module.exports = CartController;
