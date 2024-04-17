const ProductManager = require("../repositories/product.repository.js");
const CartManager = require("../repositories/cart.repository.js");
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

      res.render("products", {
        products: productsFinal,
        hasPrevPage: productsList.hasPrevPage,
        hasNextPage: productsList.hasNextPage,
        prevPage: productsList.prevPage,
        nextPage: productsList.nextPage,
        currentPage: productsList.page,
        totalPages: productsList.totalPages,
        user: req.session.user,
        cartId: req.session.user.cart,
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

      const product = await prodService.getProductById(prodId);

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

  async getCartById(req, res) {
    try {
      const cartId = req.params.cid;
      const { products } = await managerc.getCartById(cartId);

      const productsWithStringsIds = products.map((product) => ({
        quantity: product.quantity,
        _id: product._id.toString(),
      }));

      res.render("carts", { cartId: cartId, products: productsWithStringsIds });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
module.exports = ViewsController;
