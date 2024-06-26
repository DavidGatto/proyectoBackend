import UserDTO from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";
import UserRepository from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/hashBcrypt.js";
import EmailManager from "../repositories/email.repository.js";
const emailManager = new EmailManager();

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
    const { first_name, last_name, age, email, role, _id } = req.user;
    const userDto = new UserDTO(first_name, last_name, age, email, role, _id);

    res.render("current", { user: userDto, isPremium, isAdmin });
  }

  async changeRolePremium(uid) {
    try {
      const user = await userRepository.findById(uid);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar si hay al menos un documento cargado
      if (user.documents.length >= 3) {
        // Cambiar el rol del usuario a "premium"
        await userRepository.updateUserRole(uid, "premium");
        return true; // Indica que se actualizó el rol correctamente
      } else {
        // Si no hay documentos cargados, lanzar un error
        throw new Error(
          "El usuario debe cargar al menos un documento antes de cambiar el rol a premium"
        );
      }
    } catch (error) {
      console.error(error);
      throw error; // Propaga el error para que se maneje en el llamador
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

      // Guardar los cambios en la base de datos
      await user.save();
      if (user.documents.length > 0) {
        await this.changeRolePremium(uid, res);
      }

      // Envía la respuesta después de que todas las operaciones hayan sido completadas exitosamente
      res.redirect("/api/sessions/current");
    } catch (error) {
      console.error(error);
      // Envía una respuesta de error si ocurre algún problema
      res.status(500).send("Error interno del servidor");
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userRepository.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res
        .status(500)
        .send({ status: "error", message: "Error en el servidor" });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const days = 2;
      const inactiveUsers = await userRepository.deleteInactiveUsers(days);

      for (const user of inactiveUsers) {
        await emailManager.sendMailDeletion(user.email, user.first_name);
      }

      res.status(200).send({
        status: "success",
        message: "Usuarios inactivos eliminados y notificados por correo",
      });
    } catch (error) {
      console.error("Error deleting inactive users:", error);
      res
        .status(500)
        .send({ status: "error", message: "Error en el servidor" });
    }
  }

  async deleteUserById(req, res) {
    try {
      const userId = req.params.id;
      const result = await userRepository.deleteUserById(userId);

      if (!result) {
        return res
          .status(404)
          .send({ status: "error", message: "User not found" });
      }

      res
        .status(200)
        .send({ status: "success", message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error" });
    }
  }

  async updateUserRole(req, res) {
    try {
      const userId = req.params.id;
      const newRole = req.body.role;

      if (!["admin", "premium", "usuario"].includes(newRole)) {
        return res
          .status(400)
          .send({ status: "error", message: "Invalid role" });
      }

      const updatedUser = await userRepository.updateUserRole(userId, newRole);

      if (!updatedUser) {
        return res
          .status(404)
          .send({ status: "error", message: "User not found" });
      }

      res.status(200).send({
        status: "success",
        message: "User role updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error" });
    }
  }
}

export default SessionController;
