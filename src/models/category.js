const mongoose = require("mongoose");
const category = mongoose.Schema({
  name: String,
  image: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("category", category);
