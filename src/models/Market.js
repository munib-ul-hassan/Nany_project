const mongoose = require("mongoose");
const market = mongoose.Schema(
  {
    text: String,
    image: String,

    M_content: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("market", market);
