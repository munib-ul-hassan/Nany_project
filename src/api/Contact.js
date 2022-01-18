const express = require("express");
const router = express.Router();
const contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const {
      text,
      mobile,
      email,
      address,
      website,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body;

    if (
      !(
        text &&
        mobile &&
        email &&
        address &&
        website &&
        facebook &&
        instagram &&
        twitter &&
        linkedin
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      contact.find({}, (err, result) => {
        if (result) {
          res
            .status(200)
            .send({ message: "first delete then post data", success: false });
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
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", async (req, res) => {
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
router.delete("/", async (req, res) => {
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
router.get("/", async (req, res) => {
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
