
const mongoose = require("mongoose");
const attribute= mongoose.Schema(
  {
    attribute: String,
    value: String,
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("attribute", attribute);
