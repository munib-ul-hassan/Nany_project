const express = require("express");
const router = express.Router();
const HIwork = require("../models/HowItWorks");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { getStorage  } = require('firebase-admin/storage');
const bucket = getStorage().bucket('gs://nany-ffb26.appspot.com/')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/HIwork/");
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
    HIwork.find({}, async (err, result) => {
      if (result.length > 0) {
        res
          .status(200)
          .send({ message: "First delete data then post", success: false });
      } else {
        req.body.works = JSON.parse(req.body.works);
        const { text, works } = req.body;


        if (!(text && works)) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
          content = [];
console.log(works.length);  
          for (var i = 0; i < works.length; i++) {
            
  
            content.push({
              text: works[i].text || " ",
              icon: req.files ? req.files[i].path : ""
            });
            console.log(works[i].text);
          }
  
          req.body.works = content;
  
          const hiwork = new HIwork(req.body);
          hiwork.save().then((item) => {
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
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      HIwork.updateOne({ _id: id }, req.body, (err, result) => {
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
      HIwork.findOne({ _id: id }, (err, result) => {
        if (result) {
          result.works.map((item) => {

            fs.unlink(item.icon, () => { });
          })
          HIwork.deleteOne({ _id: id }, (err, result) => {
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
      HIwork.find(
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
      HIwork.find({}, (err, result) => {
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
