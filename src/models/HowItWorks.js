const mongoose = require("mongoose");
const Howitworks = mongoose.Schema(
  {
    icon:String,
    heading:String,
    text:String
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Howitworks", Howitworks);
