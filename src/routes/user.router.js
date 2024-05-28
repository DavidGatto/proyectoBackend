import express from "express";
import passport from "passport";
const router = express.Router();

import UserController from "../controllers/userController.js";
const userController = new UserController();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/failregister",
  }),
  userController.register
);

router.get("/failregister", userController.failRegister);

router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post("/reset-password", userController.resetPassword);

export default router;
