const express = require("express");
const router = express.Router();
const faq = require("../models/Faq");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../middleware/s3");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/faq/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;
    // req.body.image = req.file ? req.file.filename : "";
    // await uploadFile(req.file);
    if (!(question || answer)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Faq = new faq(req.body);
      Faq.save().then((item) => {
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      faq.findOne({ _id: id }, req.body, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          // req.body.image = req.file ? req.file.filename : "";
          // await uploadFile(req.file);

          faq.updateOne({ _id: id }, req.body, (err, result) => {
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
      faq.findOne({ _id: id }, (err, result) => {
        if (result) {
          faq.deleteOne({ _id: id }, (err, result) => {
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
        } else {
          res.status(200).send({ message: err.message, success: false });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", async (req, res) => {
  try {
    if (req.query) {
      faq.find(req.query, (err, result) => {
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
      faq.find({}, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data Not Exist", success: false });
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
module.exports = router;
