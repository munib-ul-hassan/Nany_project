const express = require("express");
const router = express.Router();
const HIwork = require("../models/HowItWorks");
const multer = require("multer");
const path = require("path");
const { tokengenerate, verifytoken } = require("../middlewear/auth");

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

router.post("/", verifytoken, upload.array("file"), (req, res) => {
  try {
    req.body.works = JSON.parse(req.body.works);

    const { text, works } = req.body;

    content = [];

    for (var i = 0; i < works.length; i++) {
      content.push({
        text: works[i].text || " ",
        icon: req.files[i] ? req.files[i].path : " ",
      });
    }

    req.body.works = content;

    if (!(text && works)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const date = new Date();
      req.body.created_at = date.toLocaleString();
      const hiwork = new HIwork(req.body);
      hiwork.save().then((item) => {
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
router.put("/", verifytoken, (req, res) => {
  try {
    console.log(req.body);
    console.log(req.query);

    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      const date = new Date();
      req.body.updated_at = date.toLocaleString();
      console.log(req.body);
      HIwork.updateOne({ _id: id }, req.body, (err, result) => {
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
router.delete("/", verifytoken, (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      HIwork.deleteOne({ _id: id }, (err, result) => {
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
router.get("/", verifytoken, (req, res) => {
  try {
    const { Search } = req.query;
    if (Search) {
      HIwork.find(
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
              token: tokengenerate({ user: req.user }),
            });
          }
        }
      );
    } else {
      HIwork.find({}, (err, result) => {
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
