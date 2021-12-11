const mongoose = require("mongoose");
const category = mongoose.Schema(
  {
    name: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", category);
