const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cartController.js");
const cartController = new CartController();

// Ruta para crear un nuevo carrito
router.post("/carts", cartController.createCart);

// Ruta para mostrar los productos de un carrito específico
router.get("/carts/:cid", cartController.getCart);

// Ruta para agregar un producto a un carrito específico
router.post("/carts/:cid/products/:pid", cartController.addProductToCart);

// Ruta para eliminar un producto de un carrito específico
router.delete("/carts/:cid/products/:pid", cartController.deleteProdFromCart);

// Ruta para actualizar el carrito con un arreglo de productos
router.put("/carts/:cid", cartController.updateCart);

// Ruta para actualizar la cantidad de ejemplares de un producto en un carrito específico

router.put("/carts/:cid/products/:pid", cartController.updateProdQuantity);

// Ruta para eliminar todos los productos de un carrito específico

router.delete("/carts/:cid", cartController.emptyCart);

module.exports = router;
