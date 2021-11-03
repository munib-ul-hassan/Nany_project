const express = require("express");
const router = express.Router();
const webSetting = require("../models/WebsiteSetting");
const multer = require("multer");
const path = require("path");
const { tokengenerate, verifytoken } = require("../middlewear/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/webSetting/");
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
    const { text, buttonText, link } = req.body;
    if (req.files.length > 0) {
      req.body.image = req.files[0].path;
    }
    if (!(text && buttonText && link)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const date = new Date();
      req.body.created_at = date.toLocaleString();
      const web = new webSetting(req.body);
      web.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
          data: item,
          success: true,
          token: tokengenerate({ user: req.user }),
        });
      });
    }
    console.log(req.body);
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/", verifytoken, (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      const date = new Date();
      req.body.updated_at = date.toLocaleString();
      webSetting.updateOne({ _id: id }, req.body, (err, result) => {
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
      webSetting.deleteOne({ _id: id }, (err, result) => {
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
      console.log(Search);

      webSetting.find(
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
            console.log(result);
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
      webSetting.find({}, (err, result) => {
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
