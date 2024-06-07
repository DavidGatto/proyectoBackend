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
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
