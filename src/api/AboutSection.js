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

router.post("/", upload.array("file"), async (req, res) => {
  try {
    about.findOne({}, (err, result) => {
      if (result) {
        res
          .status(200)
          .send({ message: "first delete data then post", success: false });
      } else {
        const { text, txt1, txt2, txt3, txt4 } = req.body;
        if (req.files.length > 0) {
          req.body.video = req.files[0] ? req.files[0].path : "";
          req.body.img1 = req.files[1] ? req.files[1].path : "";
          req.body.img2 = req.files[2] ? req.files[2].path : "";
          req.body.img3 = req.files[3] ? req.files[3].path : "";
          req.body.img4 = req.files[4] ? req.files[4].path : "";
        }
        if (!(text && txt1 && txt2 && txt3 && txt4)) {
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
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", upload.array("file"), async (req, res) => {
  try {
    const value = Object.values(req.body);
    const { id } = req.params;
    var body = {};
    if (req.files.length > 0) {
      req.files.map((item, index) => {
        if (value[index]) {
          body[value[index]] = item.path;
        }
      });
    }
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      about.findOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          value.map((item, index) => {
            fs.unlink(result[item], () => {});
          });
          about.updateOne({ _id: id }, body, (err, result) => {
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
          if (result.video) {
            fs.unlink(result.video, () => {});
          }
          // result.sections.map((item) => {
          //   if(item.image){

          //     fs.unlink(item.image, () => {});
          //   }
          // });
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
router.get("/", async (req, res) => {
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
