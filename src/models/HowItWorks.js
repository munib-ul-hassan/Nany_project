const mongoose = require("mongoose");
const Howitworks = mongoose.Schema({
  content: {
    icon: String,
    text: String,
  },
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("Howitworks", Howitworks);
