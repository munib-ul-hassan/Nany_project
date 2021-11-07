const mongoose = require("mongoose");
const banner = mongoose.Schema({
  Bgimage: String,
  heading1: String,
  heading2: String,
  text1: String,
  text2: String,
  Profile: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("banner", banner);
