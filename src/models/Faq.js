const mongoose = require("mongoose");
const Faq = mongoose.Schema({
  image: String,
  question: String,
  answer: String,
  created_at: String,
  updated_at: String,
});
module.exports = mongoose.model("faq", Faq);
