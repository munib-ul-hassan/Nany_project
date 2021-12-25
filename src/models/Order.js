const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: Number,
    address: String,
    city: String,
    country: String,
    postalCode: Number,
    quantity: Number,
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth"
    }],
    color: String,
    order_note: String,
    status: String,

  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
