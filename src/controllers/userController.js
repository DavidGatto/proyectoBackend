const CartModel = require("../models/cart.model");

class UserController {
  async register(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Datos incorrectos" });

    try {
      // Crear un nuevo carrito
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      // Asociar el carrito al usuario
      req.user.cart = nuevoCarrito;

      // Guardar el usuario actualizado en la sesión
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        cart: req.user.cart,
      };

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
}

module.exports = UserController;
