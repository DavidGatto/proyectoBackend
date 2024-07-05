import ProductManager from "../repositories/product.repository.js";
const manager = new ProductManager();

class ProductController {
  // Ruta para obtener un producto por su id
  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      const search = await manager.getProductById(pid);

      if (search) {
        // Si se encuentra el producto lo devuelve
        return res.status(200).send(search);
      } else {
        // Si no se encuentra el producto devuelve un mensaje de error
        return res
          .status(404)
          .send({ message: `A product with the id ${pid} was not found` });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  }

  // Ruta para agregar un nuevo producto
  async addProduct(req, res) {
    try {
      console.log("Datos del producto a agregar:", req.body);

      const productReq = req.body;
      if (req.file) {
        productReq.thumbnails = `${req.file.filename}`;
      }

      const product = await manager.addProduct(productReq);

      // Enviar una respuesta indicando que el producto se agregó correctamente
      res
        .status(201)
        .json({ message: "Producto agregado correctamente", product });
    } catch (error) {
      // Enviar una respuesta de error si ocurre algún problema
      res.status(500).json({ error: error.message });
    }
  }

  // Ruta para eliminar un producto por su id
  async deleteProductById(req, res) {
    try {
      const id = req.params.pid;
      const deletedProduct = await manager.deleteProductById(id);
      if (deletedProduct) {
        res.status(200).json({
          message: "Producto eliminado correctamente",
          product: deletedProduct,
        });
      } else {
        res
          .status(404)
          .json({ message: `Producto con id ${id} no encontrado` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const updateData = req.body;
      const updatedProduct = await manager.updateProduct(id, updateData);

      if (updatedProduct) {
        // Si el producto se actualizó correctamente, devolver el producto actualizado
        return res.status(200).send(updatedProduct);
      } else {
        // Si no se encuentra el producto, devolver un mensaje de error
        return res
          .status(404)
          .send({ message: `Producto con id ${id} no encontrado` });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error interno del servidor");
    }
  }
}

export default ProductController;
