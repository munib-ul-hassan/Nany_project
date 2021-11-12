const express = require("express");
const router = express.Router();
const about = require("../models/AboutSection");
const multer = require("multer");
const path = require("path");
const { tokengenerate } = require("../middleware/auth");

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

router.post("/", upload.array("file"), (req, res) => {
  try {
    const { sections, text } = req.body;
    if (req.files.length > 0) {
      req.body.video = req.files[0] ? req.files[0].path : "";
    }
    req.body.sections = JSON.parse(req.body.sections);

    if (!(sections && text)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const date = new Date();
      req.body.created_at = date.toLocaleString();
      const About = new about(req.body);

      About.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
          data: item,
          success: true,
          token: tokengenerate({ user: req.user }),
        });
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/", (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      const date = new Date();
      req.body.updated_at = date.toLocaleString();
      about.updateOne({ _id: id }, req.body, (err, result) => {
        if (err) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data updated Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
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
      about.deleteOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data deleted Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
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
    const { Search } = req.query;
    if (Search) {
      about.find(
        {
          heading1: {
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
              token: tokengenerate({ user: req.user }),
            });
          }
        }
      );
    } else {
      about.find({}, (err, result) => {
        if (!result) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
