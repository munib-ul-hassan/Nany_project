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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { text, button_text, link } = req.body;
    if (req.file.length > 0 && !(text && button_text && link)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      req.body.image = req.file.path;

      topheader.find({}, (err, result) => {
        if (result.length > 0) {
          res
            .status(200)
            .send({
              message: "first delete previous data than add ",
              success: false,
            });
        } else {
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
        if (!err) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          if (req.file) {
            fs.unlink(result.image, () => {});
            req.body.image = req.file.path;
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
          fs.unlink(result.image, () => {});
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
    const { Search } = req.query;
    if (Search) {
      topheader.find(
        {
          text: {
            $regex: Search,
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
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
