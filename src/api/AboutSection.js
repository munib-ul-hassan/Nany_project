const express = require("express");
const router = express.Router();
const about = require("../models/AboutSection");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../middleware/s3");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/about/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    about.findOne({}, async (err, result) => {
      if (result) {
        res
          .status(200)
          .send({ message: "First delete data then post", success: false });
      } else {
        const { text } = req.body;

        if (!text) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
          if (req.file) {
            await uploadFile(req.file);
            req.body.video = req.file.filename;
          }
          const About = new about(req.body);

          About.save().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      }
    });
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
      about.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data Not Exist", success: false });
        } else {
          if (req.file) {
            await uploadFile(req.file);
            req.body.video = req.file.filename;
          }
          about.updateOne({ _id: id }, req.body, (err, result) => {
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
      about.findOne({ _id: id }, (err, result) => {
        if (result) {
          
          about.deleteOne({ _id: id }, (err, result) => {
            if (!result) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data Deleted Successfully",
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
      about.find(req.query, (err, result) => {
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
    } else {
      about.find({}, (err, result) => {
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
