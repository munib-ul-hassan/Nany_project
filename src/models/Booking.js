const mongoose = require("mongoose");
const booking = mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: Number,
        address: String,
        city: String,
        country: String,
        postalCode: Number,
        from: String,
        to: String,
        timein: String,
        timeout: String,
        nany: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "auth",
            },
        ],
        user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "auth"
        }],

        comment: String,
        status: String,

    },
    { timestamps: true }
);

module.exports = mongoose.model("booking", booking);
