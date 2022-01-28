const express = require("express");
const router = express.Router();
const attribute = require("../models/Attribute");

router.post("/",async(req,res)=>{
    try{
        attribute.find({},(err,result)=>{
            if (err) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                  result.map((item)=>{
                      if(item.attribute == req.body.attribute){
                            res.status(200).send({ message: "Attribut Already exist", success: false });
                      }
                  })
                res.status(200).send({
                  message: "Data get Successfully",
                  success: true,
                  data: result,
                });
              }
        })        
        if(req.body.attribute){
    const Attribute = new attribute(req.body)
    Attribute.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
          data: item,
          success: true,
        });
      });}else{
        res
            .status(200)
            .send({ message: "All input is required", success: false });
      }
    }catch(err){
        res.send({message:err.message, success: false})
    }
})
router.get("/",async(req,res)=>{
    try{
        if(req.query){
        attribute.find(req.query,(err,result)=>{
            if (!result) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                res.status(200).send({
                  message: "Data get Successfully",
                  success: true,
                  data: result,
                });
              }
        })}else{
            attribute.find({},(err,result)=>{
                if (!result) {
                    res.status(200).send({ message: err.message, success: false });
                  } else {
                    res.status(200).send({
                      message: "Data get Successfully",
                      success: true,
                      data: result,
                    });
                  }
            })
        }
    }catch(err){
        res.send({message:err.message, success: false})
    }
})
router.put("/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        if (!id) {
          res.status(200).send({ message: "id is not specify", success: false });
        } else {
          attribute.findOne({ _id: id }, (err, result) => {
            if (result) {
              
              attribute.updateOne({ _id: id },req.body, (err, result) => {
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
    }catch(err){
        res.send({message:err.message, success: false})
    }
})
router.delete("/",async(req,res)=>{
    try{
        const { id } = req.query;
        if (!id) {
          res.status(200).send({ message: "id is not specify", success: false });
        } else {
          attribute.findOne({ _id: id }, (err, result) => {
            if (result) {
              
                attribute.deleteOne({ _id: id }, (err, result) => {
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


    }catch(err){
        res.send({message:err.message, success: false})
    }
})

module.exports = router;
