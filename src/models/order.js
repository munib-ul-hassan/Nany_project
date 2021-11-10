const mongoose = require("mongoose");
const order = mongoose.Schema({
  first_name: String,
  last_name: String,
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
  order_note: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("order", order);
