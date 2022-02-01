const mongoose = require("mongoose");
const setting = mongoose.Schema(
  {
    W_name: String,
    W_Meta_Description: String,
    W_Meta: String,
    W_About: String,
    H_Logo: String,
    F_Logo: String,
    andriod_app: String,
    ios_app: String,
    fb:String,
    google:String,
    twitter:String,
    linkedin:String,
    Address: String,
    Phone: Number,
    Email: String,
  },
  { timestamps: true }
);
const SMTP = mongoose.Schema({
Host:String,
port:String,
username:String,
pasword:String,
mail_address:String,
mail_name:String,

},{ timestamps: true })

module.exports.setting = mongoose.model("setting", setting);
module.exports.SMTP = mongoose.model("smtp", SMTP);

