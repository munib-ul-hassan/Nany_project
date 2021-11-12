const express = require("express");
const router = express.Router();
const Websetting = require("../models/Websetting");
const multer = require("multer");
const path = require("path");
const { tokengenerate } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Websetting/");
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
    const {
      W_name,
      W_Meta_Description,
      W_Meta,
      W_About,
      Social_links,
      Address,
      Phone,
      Email,
    } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!re.test(Email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    }

    if (req.files.length > 0) {
      req.body.H_Logo = req.files[0] ? req.files[0].path : "";
      req.body.F_Logo = req.files[1] ? req.files[1].path : "";
    }
    if (
      !(
        W_name &&
        W_Meta_Description &&
        W_Meta &&
        W_About &&
        Social_links &&
        Address &&
        Phone &&
        Email
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const date = new Date();
      req.body.created_at = date.toLocaleString();
      const web = new Websetting(req.body);
      web.save().then((item) => {
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
      if (req.body.Email) {
      }
      var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!re.test(req.body.Email)) {
        res.status(422).send({ message: "invlaid Email", success: false });
      }
      req.body.updated_at = date.toLocaleString();
      Websetting.updateOne({ _id: id }, req.body, (err, result) => {
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
      Websetting.deleteOne({ _id: id }, (err, result) => {
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
      Websetting.find(
        {
          Email: {
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
      Websetting.find({}, (err, result) => {
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
