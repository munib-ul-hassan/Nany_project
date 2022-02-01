const express = require("express");
const router = express.Router();
const {customer} = require("../models/Market");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file ? req.file.path : "";
    }

    customer.find({},(err,result)=>{
        if(result.length>0){
          res.status(200).send({
            message: "First delete then add new data",
            
            success: false,
          });
          
        }else{
       console.log(req.body);     
            const Customer= new customer(req.body);
            Customer.save().then((item) => {
                res.status(200).send({
                    message: "Data save into Database",
                    data: item,
                    success: true,
                });
            });
        }}) 
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
        res.status(200).send({ message: "id is not specify", success: false });
    } else {
     
            customer.findOne({_id:id},(err,result)=>{
                if(result){
                    if(req.file){
                    req.body.image = req.file ? req.file.path : "";
                    if(result.image){
                    fs.unlink(result.image,()=>{})
                }

                    }
                customer.updateOne({ _id: id }, req.body, (err, result) => {
                if (err) {
                  res.status(200).send({ message: err.message, success: false });
                } else {
                  res.status(200).send({
                    message: "Data updated Successfully",
                    success: true,
                    data: result,
                  });
                }
            
            
            })
        }else{
          res.status(200).send({
              message: "Data Not exist",
              success: false
              
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
      customer.findOne({ _id: id }, (err, result) => {
        if (result) {
          if (result.image) {
            fs.unlink(result.image, () => {});
          }
          customer.deleteOne({ _id: id }, (err, result) => {
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
        } else{
          res.status(200).send({
              message: "Data Not exist",
              success: false
              
            });
      }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", async (req, res) => {
  try {
    
    if(req.query){
        customer.find(req.query, (err, result) => {
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
    }else{
        customer.find({}, (err, result) => {
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
