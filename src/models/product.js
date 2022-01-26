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
    colors: Array,
    minQuantity:Number,
    quantity: Number,
    SKU:String

  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
