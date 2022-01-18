const mongoose = require("mongoose");
const queries = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    mobile: Number,
    email: String,
    way_to_use: String,
    message: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("queries", queries);
