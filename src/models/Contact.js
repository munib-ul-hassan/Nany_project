const mongoose = require("mongoose");
const contact = mongoose.Schema(
  {
    text: String,
    mobile: String,
    email: String,
    address: String,
    website: String,
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact", contact);
