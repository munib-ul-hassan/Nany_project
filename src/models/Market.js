const mongoose = require("mongoose");
const market = mongoose.Schema({
  text: String,
  image: String,

  content: {
    icon: String,
    text: String,
    link: String,
  },
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("market", market);
