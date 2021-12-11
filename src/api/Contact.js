const express = require("express");
const router = express.Router();
const contact = require("../models/Contact");

router.post("/", (req, res) => {
  try {
    const { first_name, last_name, email, mobile, website, message } = req.body;

    if (!(first_name && last_name && email && mobile && website && message)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Contact = new contact(req.body);
      Contact.save().then((item) => {
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
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      contact.updateOne({ _id: id }, req.body, (err, result) => {
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
      contact.deleteOne({ _id: id }, (err, result) => {
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
    contact.find({}, (err, result) => {
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
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
