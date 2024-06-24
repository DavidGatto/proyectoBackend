import ProductManager from "../repositories/product.repository.js";
import CartManager from "../repositories/cart.repository.js";
import { faker } from "@faker-js/faker";

const manager = new ProductManager();
const managerc = new CartManager();

class ViewsController {
  async getProducts(req, res) {
    try {
      let page = req.query.page;
      const limit = req.query.limit || 2;
      if (!page || isNaN(page)) {
        page = 1;
      }

      const sort = req.query.sort || "";
      const query = req.query.query || "";

      const productsList = await manager.getProducts(limit, page, sort, query);
      console.log(productsList);

      const productsFinal = productsList.docs.map((product) => {
        const { _id: _id, ...prod } = product.toObject();
        return { ...prod, _id: _id };
      });

      if (!req.session.login) {
        return res.redirect("/");
      }

      const cartId = req.user.cart.toString();
      console.log("Cart ID:", cartId);

      res.render("products", {
        products: productsFinal,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        currentPage: productsList.page,
        totalPages: productsList.totalPages,
        user: req.session.user,
        role: req.user.role,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }

  async getProductById(req, res) {
    try {
      const prodId = req.params.cid; // Cambiar de req.params.prodId a req.params.cid

      const product = await manager.getProductById(prodId);

      res.render("productDetail", {
        title: "Product Detail",
        product,
        user: req.session.user,
      });
    } catch (error) {
      console.error("Error al encontrar los detalles", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    console.log("Cart ID:", cartId);
    try {
      const carrito = await managerc.obtenerProductosDeCarrito(cartId);

      if (!carrito) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalCompra = 0;

      const productosEnCarrito = carrito.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;

        totalCompra += totalPrice;

        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render("carts", {
        products: productosEnCarrito,
        totalCompra,
        cartId,
      });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async login(req, res) {
    if (req.session.login) {
      return res.redirect("/api/products");
    }

    res.render("login");
  }

  async register(req, res) {
    if (req.session.login) {
      return res.redirect("/api/products");
    }
    res.render("register");
  }

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderRealTimeProducts(req, res) {
    const user = req.user;
    const isAdmin = user.role === "admin";
    try {
      res.render("realtimeproducts", {
        role: user.role,
        email: user.email,
        isAdmin,
      });
    } catch (error) {
      console.log("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  mockingProducts(req, res) {
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        _id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
      });
    }
    res.json(products);
  }

  async renderResetPassword(req, res) {
    res.render("passwordreset");
  }

  async renderCambioPassword(req, res) {
    res.render("passwordchange");
  }

  async renderConfirmacion(req, res) {
    res.render("shopping-confirmation");
  }
}

export default ViewsController;
