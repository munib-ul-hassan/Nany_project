const mongoose = require("mongoose");
const Howitworks = mongoose.Schema({
  text: String,
  works: [
    {
      icon: String,
      text: String,
    },
  ],
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("Howitworks", Howitworks);
