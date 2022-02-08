const express = require("express");
const router = express.Router();
const { setting } = require("../models/Websetting");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadFile } = require("../middleware/s3");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/websetting/");
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
      website_name,

      facebook,
      linkedin,
      twitter,
      google,
      ios_url,
      android_url,
      Address,
      mobile,
      Email,
    } = req.body;

    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!re.test(Email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    }


    if (
      !(
        website_name &&
        facebook &&
        linkedin &&
        twitter &&
        google &&
        ios_url &&
        android_url &&
        Address &&
        mobile &&
        Email
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      setting.find({}, async (err, result) => {
        if (result) {
          res.status(200).send({
            message: "First delete then add new data",
            success: false,
          });
        } else {
          
    if (req.files.length > 0) {
      req.body.header_image = req.files[0] ? req.files[0].filename : "";
      req.body.footer_image = req.files[1] ? req.files[1].filename : "";
      await uploadFile(req.files[0]);
      await uploadFile(req.files[1]);
    }
          const web = new setting(req.body);
          web.save().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});

router.put("/:id", upload.array("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      if (req.body.Email) {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!re.test(req.body.Email)) {
          res.status(422).send({ message: "invlaid Email", success: false });
        }
      }

      setting.findOne({ _id: id }, req.body, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.files) {
            if (req.files[0]) {
              req.body.header_image = req.files[0].filename;

              await uploadFile(req.files[0]);
              result.header_image
                ? fs.unlink(result.header_image, () => {})
                : null;
            }
            if (req.files[1]) {
              req.body.footer_image = req.files[1].filename;
              result.footer_image
                ? fs.unlink(result.footer_image, () => {})
                : null;

              await uploadFile(req.files[1]);
            }
          }
          setting.updateOne({ _id: id }, req.body, (err, result) => {
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
      setting.findOne({ _id: id }, (err, result) => {
        if (result) {
          if (result.H_Logo) {
            fs.unlink(result.H_Logo, () => {});
          }
          if (result.F_Logo) {
            fs.unlink(result.F_Logo, () => {});
          }

          setting.deleteOne({ _id: id }, (err, result) => {
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
    if (req.query) {
      setting.find(req.query, (err, result) => {
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
    } else {
      setting.find({}, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data Not Exist", success: false });
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
