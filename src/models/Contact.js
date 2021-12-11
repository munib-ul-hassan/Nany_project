const mongoose = require("mongoose");
const contact = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    mobile: Number,
    website: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", contact);
