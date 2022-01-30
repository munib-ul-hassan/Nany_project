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
    color: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color",
      },
    ],
    size: [],
    image: String,
    price: Number,
    colors: Array,
    minQuantity:Number,
    quantity: Number,
    SKU:String

  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
