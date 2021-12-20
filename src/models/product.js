const mongoose = require("mongoose");
const product = mongoose.Schema(
  {
    name: String,
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    image: String,
    price: Number,
    image: String,
    quantity: Number,
    color: Array,
    instock: Boolean,
    quantity: Number,
    star: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
