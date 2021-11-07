const mongoose = require("mongoose");
const about = mongoose.Schema({
  text: String,
  video: String,
  sections: {},
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("about", about);
