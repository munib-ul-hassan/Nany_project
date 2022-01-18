const mongoose = require("mongoose");
const category = mongoose.Schema(
  {
    text: String,
    heading: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", category);
