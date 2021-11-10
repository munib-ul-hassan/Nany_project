const mongoose = require("mongoose");
const contact = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  mobile: Number,
  website: String,
  message: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("contact", contact);
