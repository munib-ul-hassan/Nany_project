const express = require("express");
const router = express.Router();
const Websetting = require("../models/Websetting");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



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

router.post("/", upload.array("file"), async (req, res) => {
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
      const web = new Websetting(req.body);
      web.save().then((item) => {
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      if (req.body.Email) {
      }
      var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!re.test(req.body.Email)) {
        res.status(422).send({ message: "invlaid Email", success: false });
      }

      Websetting.updateOne({ _id: id }, req.body, (err, result) => {
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
      Websetting.findOne({ _id: id }, (err, result) => {
        if (result) {
          fs.unlink(result.H_Logo, () => {});
          fs.unlink(result.F_Logo, () => {});
          Websetting.deleteOne({ _id: id }, (err, result) => {
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
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
