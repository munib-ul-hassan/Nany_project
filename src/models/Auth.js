const mongoose = require("mongoose");
const auth = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  file: String,
  otp: Number,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("auth", auth);
