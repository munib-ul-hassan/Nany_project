const mongoose = require("mongoose");
const banner = mongoose.Schema(
  {
    Bgimage: String,
    heading1: String,
    heading2: String,
    text1: String,
    text2: String,
    Profile: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("banner", banner);
