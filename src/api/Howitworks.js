const express = require("express");
const router = express.Router();
const HIwork = require("../models/HowItWorks");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/HIwork/");
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
    const { text, heading } = req.body;
    HIwork.find({}, async (err, result) => {
      if (result.length > 3) {
        res
          .status(200)
          .send({ message: "First delete data then post", success: false });
      } else {
        if (!(text && heading)) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
          req.body.icon = req.file.path;

          const hiwork = new HIwork(req.body);
          hiwork.save().then((item) => {
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
      HIwork.findOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data not Exist", success: false });
        } else {
          if (req.file) {
            result.icon ? fs.unlink(result.icon, () => {}) : null;
            req.body.icon = req.file.path;
          }
          HIwork.updateOne({ _id: id }, req.body, (err, result) => {
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
      HIwork.findOne({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.icon, () => {});

          HIwork.deleteOne({ _id: id }, (err, result) => {
            if (!result) {
              res
                .status(200)
                .send({ message: "No Data Exist", success: false });
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
      HIwork.find(req.query, (err, result) => {
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
      HIwork.find({}, (err, result) => {
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
module.exports = router;
