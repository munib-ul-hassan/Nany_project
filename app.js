const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());

//routes
const webSetting = require("./src/api/WebsiteSetting");
const authentication = require("./src/api/Authentication");
const banner = require("./src/api/Banner");
const about = require("./src/api/AboutSection");
const Service = require("./src/api/Service");
const price = require("./src/api/Pricing");
const Works = require("./src/api/Howitworks");
const market = require("./src/api/Market");

//set path
app.use("/webSetting", webSetting);
app.use("/auth", authentication);
app.use("/banner", banner);
app.use("/about", about);
app.use("/Service", Service);
app.use("/Price", price);
app.use("/Work", Works);
app.use("/market", market);

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
