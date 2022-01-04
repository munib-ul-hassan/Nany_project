const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const {PDFNet} = require('@pdftron/pdfnet-node')
const path = require('path')
const fs = require('fs')

const { verifyadmintoken, verifytoken } = require('../middleware/auth')
// const {
//   ServerStyleSheets,
//   ThemeProvider
// } = require( "@material-ui/core/styles");

// const  Mailgun  = require( "mailgun-js");

// const PdfShift  = require("pdfshift");

// import PerformanceReportEmail from "../PerformanceReportEmail";

// import theme from "../../theme"; // My custom material-ui theme colors

const pdftemplate = require('../../template/invoic')
const pdf = require('html-pdf')
router.post("/", async (req, res) => {
  try {
    const { order, product } = req.body;
    // console.log(req.body);

    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(order && product)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else    
      if (!re.test(order.email)) {
        res.status(422).send({ message: "invlaid Email", success: false });
      } else {
        const count = 0
        // console.log(req.body.product);
        pdf.create(pdftemplate(req.body),{}).toFile('result.pdf',(err)=>{
if(err){
  console.log(err);
}else{
  console.log('PDF converted');
}
        })
        // product.map((item, index) => {
        //   product[index] = Object.assign(order, {
        //     product: item._id,  
        //     quantity: item.quantity,
        //     price: item.price,
        //     color: item.color
        //   })
        //   product[index].status = "Pending"

        //   const Booking = new Order(product[index]);
        //   Booking.save().then((item) => {
        //     if (item) {
        //       count++;  
        //     } else {
        //     }  
        //   })
        // })
        ///////////////////////////////
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
          host: process.env.email,  
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.email, // generated ethereal user  
            pass: process.env.password, // generated ethereal password
          },
        });
        let info = await transporter.sendMail({
          from: process.env.email, // sender address  
          to: "munibkharti123@gmail.com", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body

          html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        ///////////////////////////////

  //       const inputpath = path.resolve(__dirname,'../../file/Assignment01.pdf')      
  //       const outputpath = path.resolve(__dirname,'../../file/Invoice.pdf')
  // const textreplace =async()=>{        
  //     const pdfDoc = await PDFNet.PDFDoc.createFromFilePath(inputpath);  
  //     await pdfDoc.initSecurityHandler();
  //     const replacer = await PDFNet.ContentReplacer.create();
  //     const page = await pdfDoc.getPage(1)
      
  //     await replacer.addString("Question","Munib")
  //     // await replacer.addString("Name","Munib")
  //     // await replacer.addString("Name","Munib")
  //     // await replacer.addString("Name","Munib")
  //     await replacer.process(page)
  //     pdfDoc.save(outputpath,PDFNet.SDFDoc.SaveOptions.e_linearized)
  //  }      



// PDFNet.runWithCleanup(textreplace,"demo:1641127981940:7b5ef390030000000067b17cad66d1fa23446ceda8e6cef1d73fff0305").then(()=>{
//   fs.readFile(outputpath,(err,data)=>{
//     if(err){
//     console.log(err);  
//     }else{
//       console.log(data);  
//     }
//   })
// })
// const mailgunClient = new Mailgun({apiKey: "YOUR MAILGUN KEY", domain: "YOUR MAILGUN DOMAIN"});
// const pdfShift = new PdfShift("YOUR PDF SHIFT KEY HERE");
// const sheets = new ServerStyleSheets();
// const generatedHtml = ReactDOMServer.renderToString(
//   sheets.collect(
//     <ThemeProvider theme={theme}>
//       <PerformanceReportEmail production={production} report={report} />
//     </ThemeProvider>
//   )
// );

// const cssString = sheets.toString();
// const email = `<!DOCTYPE html>
//   <html>
//     <head>
//       <style>${cssString}</style>
//       <style type="text/css"> 
//         @media screen and (max-width: 630px) {}
//       </style>  
//     </head>
//     <body style="padding:0; margin:0">${generatedHtml}</body>
//   </html>
// `;

// const pdfOptions = {
//   margin: "20px",
//   sandbox: true,
// };

// pdfShift.convert(email, pdfOptions)
//   .then((pdfBuffer) => {
//     const attachment = new mailgunClient.Attachment({
//       data: pdfBuffer,
//       filename: "report.pdf"
//     });
//     const email = {
//       from: 'info@YOUR MAILGUN DOMAIN.com',
//       subject: 'Report',
//       html: email,
//       to: "john@doe.com",
//       attachment: attachment
//     }; 
//     return mailgunClient.messages().send(email);
//   });

        if (count == product.length) {
          res.status(200).send({
            message: "Data save into Database",
            success: true,
          });
        } else {

          res.status(200).send({
            message: product.length - count + " orders are saved other was rejected",

            success: true,
          });
        }
      }

  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", verifytoken, (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      Order.updateOne({ _id: id }, req.body, (err, result) => {
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
router.delete("/", (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      Order.deleteOne({ _id: id }, (err, result) => {
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
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", (req, res) => {
  try {


    if (!req.query) {
      Order.find(
        req.query,
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
      Order.find(
        {

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
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put('/acceptorder/:id', (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {


        Order.updateOne({ _id: id }, { status: "Accepted" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/rejectorder/:id', (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Rejected" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order Rejected", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/assignorder/:id', (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {

        Order.updateOne({ _id: id }, { status: "Assigned" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order Assign Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/cancelorder/:id', (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {

        order.updateOne({ _id: id }, { status: "Cancelled" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order Cancelled", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });

  }
})
router.put('/completeorder/:id', verifytoken, (req, res) => {
  try {
    const { id } = req.params;
    Order.findOne({ _id: id }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "Invalid selection", success: false });
      } else {
        Order.updateOne({ _id: id }, { status: "Completed" }, (err, value) => {
          if (err) {
            res.status(200).json({ message: err.message, success: false });

          } else {
            res.status(200).json({ message: "Order accepted Successfully", success: false });
          }
        })
      }
    })
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
})

module.exports = router;
