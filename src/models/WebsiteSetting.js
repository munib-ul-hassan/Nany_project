const mongoose = require("mongoose");
const webSetting = mongoose.Schema({
  image: String,
  text: String,
  buttonText: String,
  link: String,
});

module.exports = mongoose.model("webSetting", webSetting);
