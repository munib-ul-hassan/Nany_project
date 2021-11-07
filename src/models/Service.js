const mongoose = require("mongoose");
const service = mongoose.Schema({
  text: String,
  Service: [],
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("service", service);
