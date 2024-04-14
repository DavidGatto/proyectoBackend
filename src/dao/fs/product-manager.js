const fs = require("fs");

class ProductManager {
  static lastId = 0;

  async getLastId() {
    const products = await this.readFile();
    return products.length > 0
      ? Math.max(...products.map((product) => product.id))
      : 0;
  }

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Metodo para agregar un producto
  async addProduct(product) {
    const {
      title,
      description,
      price,
      status = true,
      category,
      thumbnail = "Sin imagen",
      code,
      stock,
    } = product;

    this.products = await this.readFile();

    // validamos que todos los campos sean obligatorios
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !category
    ) {
      throw new Error("Todos los campos son obligatorios!!");
    }
    // validamos que el campo code no este repetido
    if (this.products.some((product) => product.code === code)) {
      throw new Error("El código debe ser único");
    }

    // obtenemos el ultimo id y lo asignamos a la clase
    const lastIdSaved = await this.getLastId();
    ProductManager.lastId = lastIdSaved + 1;

    // creamos productos para probar las clases
    const newProduct = {
      id: ProductManager.lastId,
      title: title,
      status: status,
      category: category,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    // agregamos el nuevo producto al array
    this.products.push(newProduct);

    // agregamo el nuevo producto al archivo
    await this.saveToFile(this.products);
    return newProduct;
  }

  async getProducts() {
    this.products = await this.readFile();
    return this.products;
  }

  // Obtenemos un producto por su id
  async getProductById(id) {
    try {
      const productsArray = await this.readFile();
      const found = productsArray.find((item) => item.id === id);
      if (!found) {
        console.log("Producto no encontrado");
      } else {
        console.log("Producto encontrado");
        return found;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Leemos el archivo y devolvemos el array
  async readFile() {
    try {
      const response = fs.readFileSync(this.path, "utf-8");
      const productsArray = JSON.parse(response);
      return productsArray;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  // Guardamos el array de productos en el archivo
  async saveToFile(productsArray) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(productsArray, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  // Actualizamos un producto por su id
  async updateProduct(id, updatedProduct) {
    try {
      const productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        productsArray.splice(index, 1, updatedProduct);
        await this.saveToFile(productsArray);
      } else {
        console.log("No se ha podido actualizar el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  // Eliminamos un producto por su id
  async deleteProductById(id) {
    try {
      let productsArray = await this.readFile();

      const index = productsArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        productsArray.splice(index, 1);
        await this.saveToFile(productsArray);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("No se ha podido encontrar el producto para eliminar");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
