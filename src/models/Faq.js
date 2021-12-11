const mongoose = require("mongoose");
const Faq = mongoose.Schema(
  {
    image: String,
    question: String,
    answer: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("faq", Faq);
