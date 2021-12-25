const mongoose = require("mongoose");
const service = mongoose.Schema(
  {
    text: String,
    Service: [],

  },
  { timestamps: true }
);

module.exports = mongoose.model("service", service);
