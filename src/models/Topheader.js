const mongoose = require("mongoose");
const topheader = mongoose.Schema({
  image: String,
  text: String,
  button_text: String,
  link: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("topheader", topheader);
