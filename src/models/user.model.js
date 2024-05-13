const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["admin", "usuario"],
    default: "usuario",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  resetToken: {
    token: String,
    expiresAt: Date,
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
