const UserDTO = require("../dto/user.dto");
const UserModel = require("../models/user.model.js");

class SessionController {
  logout(req, res) {
    if (req.session.login) {
      req.session.destroy();
    }
    res.redirect("/");
  }

  async login(req, res) {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Datos incorrectos" });

    let role = "usuario";

    if (req.user.email === "adminCoder@coder.com") {
      role = "admin";
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: role,
      cart: null,
    };

    req.session.login = true;
    console.log(req.session.user); // Agrega este console.log para verificar los datos almacenados en la sesión

    res.redirect("/api/products");
  }

  async failLogin(req, res) {
    console.log("Error al iniciar sesion");
    res.send({ error: "Error al iniciar sesion" });
  }

  async github(req, res) {}

  async githubCallBack(req, res) {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/api/products");
  }

  async current(req, res) {
    const { first_name, last_name, age, email, role } = req.session.user;
    const userDto = new UserDTO(first_name, last_name, age, email, role);

    res.render("current", { user: userDto });
  }
}

module.exports = SessionController;
