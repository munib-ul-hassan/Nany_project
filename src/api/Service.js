const express = require("express");
const router = express.Router();
const service = require("../models/Service");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/service/");
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
    req.body.Service = JSON.parse(req.body.Service);

    const { text, Service } = req.body;

    content = [];

    for (var i = 0; i < Service.length; i++) {
      content.push({
        text: Service[i].text || " ",
        name: Service[i].name || " ",
        image: req.files[i] ? req.files[i].path : " ",
      });
    }

    req.body.Service = content;

    if (!(text && Service)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Banner = new service(req.body);
      Banner.save().then((item) => {
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
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      service.updateOne({ _id: id }, req.body, (err, result) => {
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
      service.findOne({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.image, () => {});
          service.deleteOne({ _id: id }, (err, result) => {
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
      service.find(
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
      service.find({}, (err, result) => {
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
