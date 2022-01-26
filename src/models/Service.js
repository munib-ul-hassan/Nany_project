const mongoose = require("mongoose");
const service = mongoose.Schema(
  {
    heading: String,
    paragraph: String,
    
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("service", service);
