const mongoose = require("mongoose");
const banner = mongoose.Schema(
  {
    image: String,
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("banner", banner);
