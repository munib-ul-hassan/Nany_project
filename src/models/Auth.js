const mongoose = require("mongoose");
const auth = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: Number,
    gender: String,
    address: String,
    city: String,
    usertype: Number,
    password: String,
    file: String,
    otp: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", auth);
