const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const {PDFNet} = require('@pdftron/pdfnet-node')
const { verifyadmintoken, verifytoken } = require("../middleware/auth");  

router.post("/", async (req, res) => {
  try {
    const { order, product } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(order && product)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(order.email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {


      
      const O = Order.find({}, (err,result)=>{
        console.log(result[result.length-1]);
      })

      
      
      
      var count = 0;
      fs.unlink('../../file/Invoice.pdf', () => {});
      const inputpath = path.resolve(__dirname,'../../file/invoice-converted.pdf')
      const outputpath = path.resolve(__dirname,'../../file/Invoice.pdf')
      
      const textreplace =async()=>{        
        const pdfDoc = await PDFNet.PDFDoc.createFromFilePath(inputpath);
        await pdfDoc.initSecurityHandler();
    const replacer = await PDFNet.ContentReplacer.create();
    const page = await pdfDoc.getPage(1)

     content = ""
    var subtotal,total,discount ,tax = 0;
    product.map((item, index) => {
      product[index] = Object.assign(order, {
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
      });
      content = content + (index+1) + "\t" + item.name + "\t"+ item.price + "\t"+ item.quantity +"\n";
      subtotal = subtotal + (item.price*item.quantity);
      
      product[index].status = "Pending";

      const Booking = new Order(product[index]);
      Booking.save().then((item) => {
        if (item) {
          count = count + 1;
        } else {
        }
      });
    });

// console.log(Date().now());


console.log(content);
await replacer.addString("invoiceno",'4')
    await replacer.addString("date", '12')
    await replacer.addString("name",order.name + "        " + 'Khatri')
    await replacer.addString("postalcode",order.postalCode)

    await replacer.addString("number",order.mobile)
    await replacer.addString("address",order.address)
    await replacer.addString("total",toString(total))
    await replacer.addString("subtotal",toString(subtotal))
    await replacer.addString("discount",toString(discount))
    await replacer.addString("tax",toString(tax))
    await replacer.addString("product",content)

    
    await replacer.process(page)
    pdfDoc.save(outputpath,PDFNet.SDFDoc.SaveOptions.e_linearized)

}

PDFNet.runWithCleanup(textreplace,"demo:1641127981940:7b5ef390030000000067b17cad66d1fa23446ceda8e6cef1d73fff0305").then(()=>{
fs.readFile(outputpath,(err,data)=>{
  if(err){
  console.log(err);
  }else{
    console.log(data);
  }
})
})

      
      // pdf
      //   .create(pdftemplate(req.body), {})
      //   .toFile(__dirname + "/invoice.pdf", (err) => {
      //     if (err) {
      //       res.status(200).send({ message: err, success: false });
      //     } else {
      //       // const invoiceid = await Order.count({});
            

            
      //send invoice to email

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: false,

        auth: {
          user: process.env.email, // generated ethereal user
          pass: process.env.password, // generated ethereal password
        },
      });
      const mailOption = {
        from: process.env.email,
        to: order.email, // sender address

        subject: "Invoice for your order", // Subject line

        attachments: [
          {
            file: "invoice.pdf",
            path: __dirname+'../../file/Invoice.pdf'
          }
        ],
      };

      await transporter.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send(err);
        } else {
          if (count == product.length) {
            res.status(200).send({
              message: "Data save into Database",
              success: true,
            });
          } else {
            res.status(200).send({
              message:
                product.length - count + " orders are saved other was rejected",
              success: true,
            });
          }
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/:id", verifytoken, async (req, res) => {
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
router.delete("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    if (!req.query) {
      Order.find(req.query, (err, result) => {
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
      Order.find({}, (err, result) => {
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
router.put("/acceptorder/:id", async (req, res) => {
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
            res
              .status(200)
              .json({ message: "Order accepted Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/rejectorder/:id", async (req, res) => {
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
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/assignorder/:id", async (req, res) => {
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
            res
              .status(200)
              .json({ message: "Order Assign Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/cancelorder/:id", async (req, res) => {
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
            res
              .status(200)
              .json({ message: "Order Cancelled", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/completeorder/:id", verifytoken, async (req, res) => {
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
            res
              .status(200)
              .json({ message: "Order accepted Successfully", success: false });
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});

module.exports = router;
