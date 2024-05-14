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

    if (req.user.email === "adminCoder@coderhouse.com") {
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

    res.redirect("/api/sessions/current");
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
    const isPremium = req.user.role === "premium";
    const isAdmin = req.user.role === "admin";
    const { first_name, last_name, age, email, role } = req.user;
    const userDto = new UserDTO(first_name, last_name, age, email, role);

    res.render("current", { user: userDto, isPremium, isAdmin });
  }

  async changeRolePremium(req, res) {
    try {
      const { uid } = req.params;

      const user = await UserModel.findById(uid);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newRole = user.role === "usuario" ? "premium" : "usuario";

      const updated = await UserModel.findByIdAndUpdate(
        uid,
        { role: newRole },
        { new: true }
      );
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = SessionController;
