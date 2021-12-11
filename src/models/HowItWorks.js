const mongoose = require("mongoose");
const Howitworks = mongoose.Schema(
  {
    text: String,
    works: [
      {
        icon: String,
        text: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Howitworks", Howitworks);
