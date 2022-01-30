
const mongoose = require("mongoose");
const attribute= mongoose.Schema(
  {
    attribute: String,
  },
  { timestamps: true }
);
const value= mongoose.Schema(
  {
    attribute :[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "attribute",
      },
    ],
    value: String,
  },
  { timestamps: true }
);

module.exports.value = mongoose.model("value", value);
module.exports.attribute = mongoose.model("attribute", attribute);
