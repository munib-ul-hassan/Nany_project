const mongoose = require("mongoose");
const about = mongoose.Schema(
  {
    text: String,
    video: String,
    img1: String,
    img2: String,
    img3: String,
    img4: String,
    txt1: String,
    txt2: String,
    txt3: String,
    txt4: String,
    heading1:String,
    heading2:String,
    heading3:String,
    heading4:String


   },
  { timestamps: true }
);

module.exports = mongoose.model("about", about);
