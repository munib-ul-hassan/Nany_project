const mongoose = require("mongoose");
const topheader = mongoose.Schema(
  {
    image: String,
    text: String,
    button_text: String,
    link: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("topheader", topheader);
