const mongoose = require("mongoose");
const Faq = mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("faq", Faq);
