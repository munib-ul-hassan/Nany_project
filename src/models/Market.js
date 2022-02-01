const mongoose = require("mongoose");
const customer = mongoose.Schema(
  {
    heading1: String,
    text1:    String,
    heading2: String,
    text2:    String,
    heading3: String,
    text3:    String,
    heading4: String,
    text4:    String,
    image:    String,
    
  },
  { timestamps: true }
);
const employer = mongoose.Schema(
  {
    heading1: String,
    text1:    String,
    heading2: String,
    text2:    String,
    heading3: String,
    text3:    String,
    heading4: String,
    text4:    String,
    image:    String,
    
  },
  { timestamps: true }
);

module.exports.customer = mongoose.model("customer", customer);
module.exports.employer = mongoose.model("employer", employer);
