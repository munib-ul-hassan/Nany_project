const mongoose = require("mongoose");
const product = mongoose.Schema({
  name: String,
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  ],
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("product", product);
