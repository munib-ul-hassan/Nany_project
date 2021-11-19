const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());

//cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",

    methods: ["GET", "POST"],

    allowedHeaders: ["Content-Type"],
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//routes
const topheader = require("./src/api/Topheader");
const authentication = require("./src/api/Authentication");
const banner = require("./src/api/Banner");
const about = require("./src/api/AboutSection");
const Service = require("./src/api/Service");
const price = require("./src/api/Pricing");
const Works = require("./src/api/Howitworks");
const market = require("./src/api/Market");
const faq = require("./src/api/faq");
const contact = require("./src/api/Contact");
const category = require("./src/api/Category");
const product = require("./src/api/Product");
const order = require("./src/api/Order");
const Websetting = require("./src/api/Websetting");
const { verifytoken } = require("./src/middleware/auth");

//set path
app.use("/uploads", express.static("uploads"));
app.use("/topheader", verifytoken, topheader);
app.use("/auth", authentication);
app.use("/banner", verifytoken, banner);
app.use("/about", verifytoken, about);
app.use("/Service", verifytoken, Service);
app.use("/Price", verifytoken, price);
app.use("/Work", verifytoken, Works);
app.use("/market", verifytoken, market);
app.use("/faq", verifytoken, faq);
app.use("/contact", verifytoken, contact);
app.use("/category", verifytoken, category);
app.use("/product", verifytoken, product);
app.use("/order", verifytoken, order);
app.use("/Websetting", verifytoken, Websetting);

//Data base connection
var url = process.env.MONGO_URL;
// var url = "mongodb://localhost:27017/Mongodb";
mongoose.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err) {
    if (err) {
      console.log("Erorr");
      console.log(err);
    } else {
      console.log("DataBase connected");
    }
  }
);

//Creating Server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is Running....`);
});
