const mongoose = require("mongoose");
const splashscreen = mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("splashscreen", splashscreen);
