const express = require("express");
const router = express.Router();
const booking = require("../models/Booking");
const { verifyadmintoken, verifytoken } = require('../middleware/auth')

router.post("/", async (req, res) => {
    try {

        const {

            name,
            email,
            mobile,
            address,
            city,
            nany,
            from,
            to,
            timestart,
            timeend,
            country,
            postalCode,
            user,
            comment,
        } = req.body;

        if (
            !(

                name &&
                email &&
                mobile &&
                address &&
                city &&
                country &&
                postalCode &&
                from &&
                to &&
                timestart &&
                timeend &&
                nany &&
                user
            )
        ) {
            res
                .status(200)
                .send({ message: "All input is required", success: false });
        } else {
            req.body.status = "Pending"
            const Booking = new booking(req.body);
            Booking.save().then((item) => {
                res.status(200).send({
                    message: "Data save into Database",
                    data: item,
                    success: true,
                });
            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
router.put("/:id", verifytoken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(200).send({ message: "id is not specify", success: false });
        } else {
            booking.findone({ _id: id }, (err, result) => {
                if (!result) {
                    res.status(200).send({ message: "Data not exist", success: false });
                } else {
                    booking.updateOne({ _id: id }, req.body, (err, result) => {
                        if (err) {
                            res.status(200).send({ message: err.message, success: false });
                        } else {
                            res.status(200).send({
                                message: "Data updated Successfully",
                                success: true,
                                data: result,
                            });
                        }
                    });
                }
            })

        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
router.delete("/", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            res.status(200).send({ message: "id is not specify", success: false });
        } else {
            booking.findone({ _id: id }, (err, result) => {
                if (!result) {
                    res.status(200).send({ message: "Data not exist", success: false });
                } else {
                    booking.deleteOne({ _id: id }, (err, result) => {
                        if (!result) {
                            res.status(200).send({ message: err.message, success: false });
                        } else {
                            res.status(200).send({
                                message: "Data deleted Successfully",
                                success: true,
                                data: result,
                            });
                        }
                    });

                }
            })
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
router.get("/", verifytoken, async (req, res) => {
    try {
        if (!req.query) {
            booking.find({}, (err, result) => {
                if (!result) {
                    res.status(200).send({ message: err.message, success: false });
                } else {
                    res.status(200).send({
                        message: "Data get Successfully",
                        success: true,
                        data: result,
                    });
                }
            })
        } else {

            booking.find(req.query, (err, result) => {
                if (!result) {
                    res.status(200).send({ message: err.message, success: false });
                } else {
                    res.status(200).send({
                        message: "Data get Successfully",
                        success: true,
                        data: result,
                    });
                }
            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});

router.put('/acceptbooking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        booking.findOne({ _id: id }, (err, result) => {
            if (!result) {
                res.status(200).send({ message: "Invalid selection", success: false });
            } else {


                booking.updateOne({ _id: id }, { status: "Accepted" }, (err, value) => {
                    if (err) {
                        res.status(200).json({ message: err.message, success: false });

                    } else {
                        res.status(200).json({ message: "booking accepted Successfully", success: false });
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });

    }
})
router.put('/rejectbooking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        booking.findOne({ _id: id }, (err, result) => {
            if (!result) {
                res.status(200).send({ message: "Invalid selection", success: false });
            } else {
                booking.updateOne({ _id: id }, { status: "Rejected" }, (err, value) => {
                    if (err) {
                        res.status(200).json({ message: err.message, success: false });

                    } else {
                        res.status(200).json({ message: "booking Rejected", success: false });
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });

    }
})
router.put('/assignbooking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        booking.findOne({ _id: id }, (err, result) => {
            if (!result) {
                res.status(200).send({ message: "Invalid selection", success: false });
            } else {
                booking.updateOne({ _id: id }, { status: "Assigned" }, (err, value) => {
                    if (err) {
                        res.status(200).json({ message: err.message, success: false });
                    } else {
                        res.status(200).json({ message: "booking Assign Successfully", success: false });
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
})
router.put('/cancelbooking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        booking.findOne({ _id: id }, (err, result) => {
            if (!result) {
                res.status(200).send({ message: "Invalid selection", success: false });
            } else {

                booking.updateOne({ _id: id }, { status: "Cancelled" }, (err, value) => {
                    if (err) {
                        res.status(200).json({ message: err.message, success: false });
                    } else {
                        res.status(200).json({ message: "booking Cancelled", success: false });
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
})
router.put('/completebooking/:id', verifytoken, async (req, res) => {
    try {
        const { id } = req.params;
        booking.findOne({ _id: id }, (err, result) => {
            if (!result) {
                res.status(200).send({ message: "Invalid selection", success: false });
            } else {
                booking.updateOne({ _id: id }, { status: "Completed" }, (err, value) => {
                    if (err) {
                        res.status(200).json({ message: err.message, success: false });

                    } else {
                        res.status(200).json({ message: "booking accepted Successfully", success: false });
                    }
                })
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });

    }
})

module.exports = router;
