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
    color: Array,
    instock: Boolean,
    quantity: Number
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
