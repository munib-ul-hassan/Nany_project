const express = require("express");
const router = express.Router();
const topheader = require("../models/Topheader");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/topheader/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });
const AWS = require("aws-sdk");
const { uploadFile } = require("../middleware/s3");
AWS.config.update({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.BUCKET_NAME,
  signatureVersion: "iDMksb4uFMzmUaldCFMHexwALKChkzUs",
});
const s3 = new AWS.S3();
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { text, button_text, link } = req.body;

    if (!req.file || !(text && button_text && link)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      topheader.find({}, async (err, result) => {
        if (result) {
          res.status(200).send({
            message: "First Delete data then post",
            success: false,
          });
        } else {
          await uploadFile(req.file);
          req.body.image = req.file.filename;

          const web = new topheader(req.body);
          web.save().then((item) => {
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
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      topheader.findOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.file) {
            if (result.image) {
              fs.unlink(result.image, () => {});
            }
            req.body.image = req.file.filename;
          }

          topheader.updateOne({ _id: id }, req.body, (err, result) => {
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
      topheader.findOne({ _id: id }, (err, result) => {
        
        if (result) {
          if (result.image) {
            fs.unlink(result.image, () => {});
          }
          topheader.deleteOne({ _id: id }, (err, result) => {
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
          res.status(200).json({ message: err.message, success: false });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});

router.get("/", async (req, res) => {
  try {
    topheader.find({}, (err, result) => {
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
