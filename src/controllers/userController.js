const CartModel = require("../models/cart.model");
const EmailManager = require("../repositories/email.repository.js");
const emailManager = new EmailManager();
const UserModel = require("../models/user.model.js");
const crypto = require("crypto");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");

class UserController {
  async register(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Datos incorrectos" });

    try {
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      req.user.cart = nuevoCarrito._id;

      req.session.user = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
        cart: nuevoCarrito._id,
      };

      await req.user.save();

      req.session.login = true;

      res.redirect("/api/products");
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res
        .status(500)
        .send({ status: "error", message: "Error en el servidor" });
    }
  }

  async failRegister(req, res) {
    res.send({ error: "Error al registrarse" });
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const token = crypto.randomBytes(6).toString("hex");

      user.resetToken = {
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
      };
      await user.save();

      await emailManager.sendMailReset(email, user.first_name, token);

      res.redirect("/confirmation-shipment");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.render("passwordchange", { error: "User not found" });
    }
    console.log(token);
    const resetToken = user.resetToken;

    if (!resetToken || resetToken.token !== token) {
      return res.render("passwordreset", {
        error: "Password reset token is invalid",
      });
    }

    const now = new Date();
    if (now > resetToken.expiresAt) {
      return res.redirect("/passwordchange");
    }
    if (isValidPassword(password, user)) {
      return res.render("passwordchange", {
        error: "The new password cannot be the same as the previous one",
      });
    }

    user.password = createHash(password);
    user.set("resetToken", undefined);
    await user.save();

    return res.redirect("/");
  }
  catch(error) {
    console.error(error);
    return res
      .status(500)
      .render("passwordreset", { error: "Error interno del servidor" });
  }
}

module.exports = UserController;
