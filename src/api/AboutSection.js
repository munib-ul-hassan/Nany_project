const express = require("express");
const router = express.Router();
const about = require("../models/AboutSection");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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


    about.findOne({}, (err, result) => {
      if (result) {
        res
          .status(200)
          .send({ message: "first delete data then post", success: false });
      } else {
        req.body.sections = JSON.parse(req.body.sections);
        const { sections, text } = req.body;
        if (req.files.length > 0) {
          req.body.video = req.files[0] ? req.files[0].path : "";
          req.body.sections[0].image = req.files[1] ? req.files[1].path : "";
          req.body.sections[1].image = req.files[2] ? req.files[2].path : "";
          req.body.sections[2].image = req.files[3] ? req.files[3].path : "";
          req.body.sections[3].image = req.files[4] ? req.files[4].path : "";
        }

        if (!(sections && text)) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
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
    })

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
      about.findOne({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.video, () => { });
          result.sections.map((item) => {
            fs.unlink(item.image, () => { });
          })
          about.deleteOne({ _id: id }, (err, result) => {
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
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
