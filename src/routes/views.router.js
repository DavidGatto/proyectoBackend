const express = require("express");
const router = express.Router();

const ViewsController = require("../controllers/viewsController.js");
const viewsController = new ViewsController();

router.get("/register", viewsController.register);

router.get("/", viewsController.login);

router.get("/api/products", viewsController.getProducts);

router.get("/products/:productId", viewsController.getProductById);

router.get("/api/carts/:cid", viewsController.renderCart);

router.get("/realtimeproducts", viewsController.renderRealTimeProducts);
router.get("/chat", viewsController.renderChat);
router.get("/mockingproducts", viewsController.mockingProducts);
module.exports = router;
