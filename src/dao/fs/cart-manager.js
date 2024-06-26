import { promises as fs } from "fs";

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.error("Error al cargar los carritos", error);
      await this.saveCarts();
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    const newCart = {
      id: ++this.ultId,
      products: [],
    };

    this.carts.push(newCart);

    await this.saveCarts();
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const cart = this.carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error(`No se encontró el carrito con ID ${cartId}`);
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener carrito por el ID", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const indexProduct = cart.products.findIndex(
      (product) => product.product === productId
    );

    if (indexProduct !== -1) {
      cart.products[indexProduct].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
