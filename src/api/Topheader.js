const express = require("express");
const router = express.Router();
const topheader = require("../models/Topheader");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/topheader/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });
const AWS = require("aws-sdk")
AWS.config.update({
  accessKeyId: process.env.ID,
  secretAccessKey:  process.env.BUCKET_NAME,
  signatureVersion: 'iDMksb4uFMzmUaldCFMHexwALKChkzUs',
});
;
const s3 = new AWS.S3();
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { text, button_text, link } = req.body;
    console.log(req.file.path);
    if (!req.file || !(text && button_text && link)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      // const params = {
      //   "Bucket": process.env.BUCKET_NAME,
      //   "Key": req.file.filename, // File name you want to save as in S3
      //   "Body": fs.readFileSync(req.file.path),
      // };

      // Uploading files to the bucket
      // s3.upload(params, function (err, data) {
      //   if (err) {
      //     throw err;
      //   }
      // });

      // async function getImage(){
      //   const data =  s3.getObject(
      //     {
      //         Bucket: process.env.BUCKET_NAME,
      //         Key: "file-1643874882122.png"
      //       }
      //   ).promise();
      //   return data;
      // }

      // getImage()
      //     .then((img)=>{
      //         let startHTML="<html><body></body>";
      //         let endHTML="</body></html>";
      //         let html=startHTML + "<img src='data:image/png;base64," + encode(img.Body) + "'" + "/>" + endHTML;
      //       res.send(html)
      //     }).catch((e)=>{
      //       res.send(e)
      //     })
      //     function encode(data)
      //     {
      //         let buf = Buffer.from(data);
      //         let base64 = buf.toString('base64');
      //         return base64
      //     }
      
      var params = { Bucket: process.env.BUCKET_NAME, Key:'file-1643874882122.png' };
      console.log(params);
      s3.getObject(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });


      // req.body.image = req.file.path;
      // topheader.find({}, (err, result) => {
      //   if (result.length > 0) {
      //     res.status(200).send({
      //       message: "first delete previous data than add ",
      //       success: false,
      //     });
      //   } else {
      //     const web = new topheader(req.body);
      //     web.save().then((item) => {
      //       res.status(200).send({
      //         message: "Data save into Database",
      //         data: item,
      //         success: true,
      //       });
      //     });
      //   }
      // });
    }
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
      topheader.findOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.file) {
            if (result.image) {
              fs.unlink(result.image, () => {});
            }
            req.body.image = req.file.path;
          }

          topheader.updateOne({ _id: id }, req.body, (err, result) => {
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
      topheader.findOne({ _id: id }, (err, result) => {
        if (result) {
          if (result.image) {
            fs.unlink(result.image, () => {});
          }
          topheader.deleteOne({ _id: id }, (err, result) => {
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
          res.status(200).json({ message: err.message, success: false });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});

const {getFileStream} = require('../middleware/s3')
router.get("/", async (req, res) => {
  try {
    

    const readstream = getFileStream('file-1643907109054.png')
    readstream.pipe(res)



    // var params = { Bucket: process.env.BUCKET_NAME, Key:'file-1643907109054.png' };
      // console.log(params);
      
      // return s3.getObject(params).createReadStream().pipe(res);
      //  const data = s3.getObject(params).promise();
      //  res.send(data)
    // topheader.find({}, (err, result) => {
    //   if (!result) {
    //     res.status(200).send({ message: err.message, success: false });
    //   } else {
    //     res.status(200).send({
    //       message: "Data get Successfully",
    //       success: true,
    //       data: result,
    //     });
    //   }
    // });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
