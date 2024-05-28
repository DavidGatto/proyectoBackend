import express from "express";
const router = express.Router();

import ViewsController from "../controllers/viewsController.js";
const viewsController = new ViewsController();

router.get("/register", viewsController.register);

router.get("/", viewsController.login);

router.get("/api/products", viewsController.getProducts);

router.get("/products/:productId", viewsController.getProductById);

router.get("/api/carts/:cid", viewsController.renderCart);

router.get("/realtimeproducts", viewsController.renderRealTimeProducts);
router.get("/chat", viewsController.renderChat);
router.get("/mockingproducts", viewsController.mockingProducts);

router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/confirmation-shipment", viewsController.renderConfirmacion);
export default router;
