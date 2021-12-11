const express = require("express");
const router = express.Router();
const order = require("../models/Order");
const { verifyadmintoken, verifytoken } = require('../middleware/auth')

router.post("/", verifytoken, (req, res) => {
  try {
    const {
      fullname,
      email,
      mobile,
      address,
      city,
      startdate,
      enddate,
      starttime,
      endtime,
      country,
      postal_code,
      quantity,
      order_note,
    } = req.body;

    if (
      !(
        fullname &&
        email &&
        mobile &&
        address &&
        city &&
        country &&
        startdate &&
        enddate &&
        starttime &&
        endtime &&
        postal_code &&
        quantity &&
        order_note
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      req.body.status = "Pending"
      const Order = new order(req.body);
      Order.save().then((item) => {
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
router.put("/:id", verifytoken, (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      order.updateOne({ _id: id }, req.body, (err, result) => {
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
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.delete("/", verifytoken, (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      order.deleteOne({ _id: id }, (err, result) => {
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
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", verifytoken, (req, res) => {
  try {
    const { email, by_status } = req.query;
    if (email && by_status) {
      order.find(
        {
          email: {
            $regex: email,
            $options: "i",
          },
          staus: by_status,
        },
        (err, result) => {
          if (!result) {
            res.status(200).send({ message: err.message, success: false });
          } else {
            res.status(200).send({
              message: "Data get Successfully",
              success: true,
              data: result,
            });
          }
        }
      );
    } else if (email) {
      order.find(
        {
          email: {
            $regex: email,
            $options: "i",
          },
        },
        (err, result) => {
          if (!result) {
            res.status(200).send({ message: err.message, success: false });
          } else {
            res.status(200).send({
              message: "Data get Successfully",
              success: true,
              data: result,
            });
          }
        }
      );
    } else {
      order.find({}, (err, result) => {
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
router.put('/acceptorder/:id', verifyadmintoken, (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {

        order.updateOne({ _id: id }, { status: "Accepted" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/rejectorder/:id', verifyadmintoken, (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        order.updateOne({ _id: id }, { status: "Rejected" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/assignorder/:id', verifyadmintoken, (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {

        order.updateOne({ _id: id }, { status: "Assigned" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/cancelorder/:id', verifyadmintoken, (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {

        order.updateOne({ _id: id }, { status: "Cancelled" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/completeorder/:id', verifytoken, (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        order.updateOne({ _id: id }, { status: "Completed" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})

module.exports = router;
