const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    fname: String,
    lname: String,
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
    color: String,
    from: String,
    to: String,
    starttime: String,
    endtime: String,
    order_note: String,

    status: String,
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
