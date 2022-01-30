const mongoose = require("mongoose");
const color = mongoose.Schema(
  {
    color: String ,   
    code: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("color", color);
