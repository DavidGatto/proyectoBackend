const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/userController.js");
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

module.exports = router;
