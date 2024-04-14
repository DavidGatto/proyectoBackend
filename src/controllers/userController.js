const CartModel = require("../models/cart.model.js");
class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existeUsuario = await UserModel.findOne({ email });
      if (existeUsuario) {
        return res.status(400).send("El usuario ya existe");
      }

      //Creo un nuevo carrito:
      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      const nuevoUsuario = new UserModel({
        first_name,
        last_name,
        email,
        cart: nuevoCarrito._id,
        password: createHash(password),
        age,
      });

      await nuevoUsuario.save();

      const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async failRegister(req, res) {
    res.send({ error: "Error al registrarse" });
  }
}

module.exports = UserController;
