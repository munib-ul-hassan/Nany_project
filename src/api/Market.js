const express = require("express");
const router = express.Router();
const market = require("../models/Market");

const multer = require("multer");
const path = require("path");
const { tokengenerate } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/market/");
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
    req.body.content = JSON.parse(req.body.content);
    const { text, content } = req.body;

    if (req.files.length > 0) {
      req.body.image = req.files[0] ? req.files[0].path : "";
    }

    if (!(text && content)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      data = [];

      for (var i = 0; i < content.length; i++) {
        data.push({
          icon: req.files[i + 1] ? req.files[i + 1].path : " ",
          text: content[i].text || "",
          link: content[i].link || "",
        });
      }
      req.body.M_content = data;
      const date = new Date();
      req.body.created_at = date.toLocaleString();

      const Market = new market(req.body);
      Market.save().then((item) => {
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
router.put("/", upload.array("file"), (req, res) => {
  try {
    const { id } = req.query;
    if (req.files) {
      req.body.image = req.files[0] ? req.files[0].path : "";
      if (req.body.M_content) var data = [];
      for (var i = 0; i < req.body.M_content.length; i++) {
        data.push({
          icon: req.files ? req.files[i + 1].path : " ",
          text: req.body.M_content[i].text || "",
          link: req.body.M_content[i].link || "",
        });
      }
      req.body.M_content = data;
    }
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      const date = new Date();
      req.body.updated_at = date.toLocaleString();

      market.updateOne({ _id: id }, req.body, (err, result) => {
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
      market.deleteOne({ _id: id }, (err, result) => {
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
      market.find(
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
      market.find({}, (err, result) => {
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
