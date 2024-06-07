import mongoose from "mongoose";

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
    enum: ["admin", "usuario", "premium"],
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
  documents: [
    {
      name: String,
      reference: String,
    },
  ],

  last_connection: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
