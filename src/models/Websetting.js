const mongoose = require("mongoose");
const setting = mongoose.Schema(
  {
    website_name: String,
    header_image: String,
    footer_image: String,
    android_url: String,
    ios_url: String,
    facebook: String,
    google: String,
    twitter: String,
    linkedin: String,
    Address: String,
    mobile: Number,
    Email: String,
  },
  { timestamps: true }
);
const SMTP = mongoose.Schema(
  {
    Host: String,
    port: String,
    username: String,
    pasword: String,
    mail_address: String,
    mail_name: String,
  },
  { timestamps: true }
);

module.exports.setting = mongoose.model("setting", setting);
module.exports.SMTP = mongoose.model("smtp", SMTP);
