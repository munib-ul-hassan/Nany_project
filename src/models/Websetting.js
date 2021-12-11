const mongoose = require("mongoose");
const Websetting = mongoose.Schema(
  {
    W_name: String,
    W_Meta_Description: String,
    W_Meta: String,
    W_About: String,
    H_Logo: String,
    F_Logo: String,
    Social_links: String,
    Address: String,
    Phone: Number,
    Email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Websetting", Websetting);
