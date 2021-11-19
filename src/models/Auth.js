const mongoose = require("mongoose");
const auth = mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    file: String,
    otp: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", auth);
