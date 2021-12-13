const mongoose = require("mongoose");
const banner = mongoose.Schema(
  {
    Bgimage: String,
    Primage: String,

    Bt1: String,
    Bt2: String,
    Pt1: String,
    Pt2: String,
    Profile: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("banner", banner);
