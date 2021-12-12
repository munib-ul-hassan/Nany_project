const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    fullname: String,
    email: String,
    mobile: Number,
    address: String,
    city: String,
    country: String,
    postal_code: Number,
    quantity: Number,
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
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
