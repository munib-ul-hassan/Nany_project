const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const { verifyadmintoken, verifytoken } = require("../middleware/auth");
const pdftemplate = require("../../template/invoice");
const pdf = require("html-pdf");

router.post("/", async (req, res) => {
  try {
    const { order, product } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(order && product)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(order.email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {
      var count = 0;
      fs.unlink("./invoice.pdf", () => {});
      const invoiceid = await Order.count({});
      req.body.id = invoiceid;
      pdf
        .create(pdftemplate(req.body), {})
        .toFile(__dirname + "/invoice.pdf", (err) => {
          if (err) {
            res.status(200).send({ message: err, success: false });
          } else {
            product.map((item, index) => {
              product[index] = Object.assign(order, {
                product: item._id,
                quantity: item.quantity,
                price: item.price,
                color: item.color,
              });
              product[index].status = "Pending";

              const Booking = new Order(product[index]);
              Booking.save().then((item) => {
                if (item) {
                  count = count + 1;
                } else {
                }
              });
            });
          }
        });

      //save in to database

      //send invoice to email

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: false,

        auth: {
          user: process.env.email, // generated ethereal user
          pass: process.env.password, // generated ethereal password
        },
      });
      const mailOption = {
        from: process.env.email,
        to: order.email, // sender address

        subject: "Invoice for your order", // Subject line

        attachments: [
          {
            file: "invoice.pdf",
            path: __dirname + "/invoice.pdf",
          },
        ],
      };

      await transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send(err);
        } else {
          if (count == product.length) {
            res.status(200).send({
              message: "Data save into Database",
              success: true,
            });
          } else {
            res.status(200).send({
              message:
                product.length - count + " orders are saved other was rejected",
              success: true,
            });
          }
        }
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
      Order.updateOne({ _id: id }, req.body, (err, result) => {
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
router.delete("/", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      Order.deleteOne({ _id: id }, (err, result) => {
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
router.get("/", async (req, res) => {
  try {
    if (!req.query) {
      Order.find(req.query, (err, result) => {
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
    } else {
      Order.find({}, (err, result) => {
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
router.put("/acceptorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Accepted" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });
          } else {
            res
              .status(200)
              .json({ message: "Order accepted Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/rejectorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Rejected" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });
          } else {
            res.status(200).json({ message: "Order Rejected", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/assignorder/:id", async (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Assigned" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });
          } else {
            res
              .status(200)
              .json({ message: "Order Assign Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/cancelorder/:id", async (req, res) => {
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
            res
              .status(200)
              .json({ message: "Order Cancelled", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/completeorder/:id", verifytoken, async (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Completed" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });
          } else {
            res
              .status(200)
              .json({ message: "Order accepted Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});

module.exports = router;
