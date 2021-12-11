const mongoose = require("mongoose");
const pricing = mongoose.Schema(
  {
    text: String,
    package: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("pricing", pricing);
