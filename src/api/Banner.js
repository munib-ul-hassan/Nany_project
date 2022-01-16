const express = require("express");
const router = express.Router();
const banner = require("../models/Banner");
const multer = require("multer");
const path = require("path");
const fs = require("fs");





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/banner/");
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
    if (req.files.length > 0) {
      req.body.image = req.file.path
      const Banner = new banner(req.body);
      Banner.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
          data: item,
          success: true,
        });
      });
    }
    else {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", upload.array('file'), async (req, res) => {
  try {

    const { id, } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      banner.findById({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.Bgimage, () => { })
          req.body.image = req.files[0].path
          banner.updateOne({ _id: id }, req.body, (err, result) => {
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
        } else {
          res.status(200).send({ message: "id is not specify", success: false });

        }
      })
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
      banner.findOne({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.Bgimage, () => { });


          banner.deleteOne({ _id: id }, (err, result) => {
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
          res.status(200).send({ message: "Data not exist", success: false });
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
      banner.find(
        {
          Bt1: {
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
      banner.find({}, (err, result) => {
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
