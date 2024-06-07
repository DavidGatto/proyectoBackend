import UserDTO from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";
import UserRepository from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/hashBcrypt.js";

const userRepository = new UserRepository();

class SessionController {
  logout(req, res) {
    if (req.session.login) {
      req.session.destroy();
    }
    res.redirect("/");
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuarioEncontrado = await userRepository.findByEmail(email);

      if (!usuarioEncontrado) {
        return res.status(401).send("Usuario no válido");
      }

      const esValido = isValidPassword(password, usuarioEncontrado);
      if (!esValido) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const role =
        usuarioEncontrado.email === "adminCoder@coderhouse.com"
          ? "admin"
          : "usuario";

      usuarioEncontrado.last_connection = new Date();
      await usuarioEncontrado.save();

      req.session.user = {
        id: usuarioEncontrado.id,
        first_name: usuarioEncontrado.first_name,
        last_name: usuarioEncontrado.last_name,
        age: usuarioEncontrado.age,
        email: usuarioEncontrado.email,
        role: role,
        cart: usuarioEncontrado.cart || null,
      };

      req.session.login = true;

      res.redirect("/api/sessions/current");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
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

  async changeRolePremium(uid, res) {
    try {
      const user = await userRepository.findById(uid);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Cambiar el rol del usuario a "premium"
      const updated = await userRepository.updateUserRole(uid, "premium");
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async uploadDocuments(req, res) {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
      const user = await userRepository.findById(uid);

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      if (uploadedDocuments) {
        if (uploadedDocuments.document) {
          user.documents = user.documents.concat(
            uploadedDocuments.document.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
        if (uploadedDocuments.products) {
          user.documents = user.documents.concat(
            uploadedDocuments.products.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
        if (uploadedDocuments.profile) {
          user.documents = user.documents.concat(
            uploadedDocuments.profile.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
      }

      await user.save();

      // Envía la respuesta solo si todo salió bien
      res.status(200).send("Documentos subidos exitosamente");
    } catch (error) {
      console.error(error);
      // Envía una respuesta de error si ocurre algún problema
      res.status(500).send("Error interno del servidor");
    }
  }
}

export default SessionController;
