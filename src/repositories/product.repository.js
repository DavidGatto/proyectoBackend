import ProductModel from "../models/product.model.js";
import logger from "../utils/logger.js";
import fs from "fs";
import path from "path";

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    status = true,
    category,
    thumbnails = "Sin imagen",
    code,
    stock,
    owner,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios");
      }

      const productExists = await ProductModel.findOne({ code: code });

      if (productExists) {
        throw new Error("El código debe ser único");
      }

      console.log("Owner", owner);

      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status: true,
        owner,
      });

      await newProduct.save();
      logger.info(`Product created: ${JSON.stringify(newProduct)}`);

      return newProduct;
    } catch (error) {
      console.log("Error al agregar el producto", error);
      throw error;
    }
  }
  async getProducts(limit, page, sort, query) {
    try {
      console.log("Iniciando consulta de productos en la base de datos...");

      const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        sort:
          sort === "desc"
            ? { price: -1 }
            : sort === "asc"
            ? { price: 1 }
            : { _id: 1 },
      };

      const filter = {};
      if (query && query.category && typeof query.category === "string") {
        filter.category = query.category;
      }

      const products = await ProductModel.paginate(filter, options);
      return products;
    } catch (error) {
      console.log("Error al obtener los productos", error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }

      logger.info(`Product updated: ${JSON.stringify(updatedProduct)}`);
      return updatedProduct;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const foundProduct = await ProductModel.findById(id);

      if (!foundProduct) {
        console.log(`A product with the id ${id} was not found.`);
        return null;
      }

      console.log("Product found:", foundProduct);
      return foundProduct;
    } catch (error) {
      console.log("Error getting a product by id");
    }
  }

  async deleteProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        console.log("No se encuentra el producto");
        return null;
      }

      if (product.thumbnails && product.thumbnails !== "Sin imagen") {
        const imagePath = path.resolve(
          `./src/uploads/imageproduct/${product.thumbnails}`
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error al eliminar la imagen:", err);
          } else {
            console.log("Imagen eliminada:", product.thumbnails);
          }
        });
      }

      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto eliminado");
      return deleted;
    } catch (error) {
      console.log("Error al eliminar", error);
      throw error;
    }
  }
}

export default ProductManager;
