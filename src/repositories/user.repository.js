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

  async findAll() {
    try {
      return await UserModel.find({}, "first_name last_name email role");
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById(id) {
    try {
      return await UserModel.findByIdAndDelete(id);
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

  async deleteInactiveUsers(days) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const inactiveUsers = await UserModel.find({
      $or: [
        { last_connection: { $lt: dateLimit } },
        { last_connection: { $exists: false } },
      ],
    });

    await UserModel.deleteMany({
      $or: [
        { last_connection: { $lt: dateLimit } },
        { last_connection: { $exists: false } },
      ],
    });

    return inactiveUsers;
  }
}

export default UserRepository;
