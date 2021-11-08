const mongoose = require("mongoose");
const market = mongoose.Schema({
  text: String,
  image: String,

  M_content: [],
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("market", market);
