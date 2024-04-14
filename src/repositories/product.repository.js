const ProductModel = require("../models/product.model.js");

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
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("Todos los campos son obligatorios");
      }

      const productExists = await ProductModel.findOne({ code: code });

      if (productExists) {
        throw new Error("El código debe ser único");
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status: true,
      });

      await newProduct.save();
      console.log("Producto agregado");

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

  async getProductById(req, res) {
    const pid = req.params.pid;

    try {
      const prod = await ProductModel.findById(pid); // Cambio aquí
      if (prod) {
        res.json(prod);
      } else {
        res.json({ Error: "No se encontró el producto" }); // Error aquí
      }
    } catch (error) {
      res.status(500).json({ msg: "Error  del servidor" });
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);

      if (!updated) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto actualizado");
      return updated;
    } catch (error) {
      console.log("Error al actualizar", error);
    }
  }

  async deleteProductById(id) {
    try {
      const deleted = await ProductModel.findByIdAndDelete(id);

      if (!deleted) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto eliminado");
    } catch (error) {
      console.log("Error al eliminar", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
