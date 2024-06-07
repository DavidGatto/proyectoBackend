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

  // Ruta para actualizar un producto existente por su id
  async updateProduct(req, res) {
    try {
      const id = req.params.pid;
      const productUpdate = await manager.updateProduct(id, req.body);
      res.status(200).json({
        message: "Producto actualizado correctamente",
        product: productUpdate,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Ruta para eliminar un producto por su id
  async deleteProductById(req, res) {
    try {
      const id = req.params.pid;
      const deletedProduct = await manager.deleteProductById(id);
      res.status(200).json({
        message: "Producto eliminado correctamente",
        product: deletedProduct,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductController;
