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

router.post("/", upload.array("file"), async (req, res) => {
  try {
    const { heading, paragraph, btnLink } = req.body;
    

    req.body.image = req.files[0] ? req.files[0].path : "";
    
    if (!(heading, paragraph, btnLink)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Service = new service(req.body);
      Service.save().then((item) => {
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
router.put("/:id", upload.array("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (res.files) {
      req.body.image = req.files[0].path;
    }
    
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
router.delete("/", async (req, res) => {
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
router.get("/", async (req, res) => {
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
              data: result[0],
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

router.get("/byid/:id", (req, res) => {
  try {
    const { id } = req.params;
    service.findOne({ _id: id }, (err, result) => {
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
