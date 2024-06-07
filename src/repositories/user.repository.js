import UserModel from "../models/user.model.js";

class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findById(id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async create(user) {
    try {
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async save(user) {
    try {
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar si hay documentos cargados
      if (user.documents.length === 3) {
        // Actualizar el rol del usuario
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { role: newRole },
          { new: true }
        );
        return updatedUser;
      } else {
        // Si no hay documentos cargados, lanzar un error
        throw new Error(
          "El usuario debe cargar al menos un documento antes de cambiar el rol"
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
