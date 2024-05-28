import express from "express";
const router = express.Router();

import ProductController from "../controllers/productController.js";
const productController = new ProductController();

// Ruta para obtener un producto por su id
router.get("/products/:pid", productController.getProductById);

// Ruta para agregar un nuevo producto
router.post("/products", productController.addProduct);

// Ruta para actualizar un producto existente por su id
router.put("/products/:pid", productController.updateProduct);

// Ruta para eliminar un producto por su id
router.delete("/products/:pid", productController.deleteProductById);

export default router;
