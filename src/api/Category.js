const express = require("express");
const router = express.Router();

const path = require("path");
const category = require("../models/Category");
const fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category/");
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
    const { text, heading } = req.body;

    if (req.files) {
      req.body.image = req.file ? req.file.path : "";
    }
    if (!(text && heading)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Category = new category(req.body);
      Category.save().then((item) => {
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

    
    if (id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      category.findOne({_id:id},(err,result)=>{
        if(err){
          res.status(200).send({ message: err.message, success: false });

        }else{
          if (req.files) {
            req.body.image = req.files[0] ? req.files[0].path : "";
            if(result.image){
              fs.unlink(result.image, () => {});}
            
          }      

          category.updateOne({ _id: id }, req.body, (err, result) => {
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
      category.find({ _id: id }, (err, result) => {
        if (result) {
          if(result.image){
            fs.unlink(result.image, () => {});}
          category.deleteOne({ _id: id }, (err, val) => {
            if (!val) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data deleted Successfully",
                success: true,
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
      category.find(req.query, (err, result) => {
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
      category.find({}, (err, result) => {
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
