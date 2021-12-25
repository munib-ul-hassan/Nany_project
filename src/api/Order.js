const express = require("express");
const router = express.Router();
const order = require("../models/Order");
const { verifyadmintoken, verifytoken } = require('../middleware/auth')

router.post("/", (req, res) => {
  try {
    console.log(req.body);
    const {

      name,
      email,
      mobile,
      address,
      city,
      user,
      country,
      postalCode,
      quantity,
      order_note,
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
        quantity &&
        user

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
router.delete("/", (req, res) => {
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
router.get("/", (req, res) => {
  try {


    if (!req.query) {
      order.find(
        req.query,
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
      order.find(
        {

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
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put('/acceptorder/:id', (req, res) => {
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
router.put('/rejectorder/:id', (req, res) => {
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
            res.status(200).json({ message: "Order Rejected", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/assignorder/:id', (req, res) => {
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
            res.status(200).json({ message: "Order Assign Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/cancelorder/:id', (req, res) => {
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
            res.status(200).json({ message: "Order Cancelled", success: false });
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
