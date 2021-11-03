const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());

//routes
const webSetting = require("./src/api/WebsiteSetting");
const authentication = require("./src/api/Authentication");

//set path
app.use("/webSetting", webSetting);
app.use("/auth", authentication);

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
