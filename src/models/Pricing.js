const mongoose = require("mongoose");
const pricing = mongoose.Schema({
  text: String,
  package: [],
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("pricing", pricing);
