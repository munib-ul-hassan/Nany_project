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
    color: [],
    size: [],
    image: [],
    price: Number,
    description: String,
    minQuantity: Number,
    quantity: Number,
    SKU: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
