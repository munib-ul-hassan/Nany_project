const mongoose = require("mongoose");
const about = mongoose.Schema(
  {
    text: String,
    video: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("about", about);
