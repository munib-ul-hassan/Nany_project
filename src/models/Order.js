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
    products: [],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
      },
    ],
    color: String,
    order_note: String,
    status: String,
    invoiceid: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
