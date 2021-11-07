const express = require("express");
const router = express.Router();
const price = require("../models/Pricing");

const { tokengenerate, verifytoken } = require("../middlewear/auth");

router.post("/", verifytoken, (req, res) => {
  try {
    const { text, package } = req.body;

    content = [];

    for (var i = 0; i < package.length; i++) {
      content.push({
        name: package[i].name || "",
        price: package[i].price || 0,
        type: package[i].type || "",
        detail: package[i].detail || "",
      });
    }

    req.body.package = content;

    if (!(text && package)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const date = new Date();
      req.body.created_at = date.toLocaleString();
      const Price = new price(req.body);
      Price.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
          data: item,
          success: true,
          token: tokengenerate({ user: req.user }),
        });
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.put("/", verifytoken, (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      const date = new Date();
      req.body.updated_at = date.toLocaleString();

      price.updateOne({ _id: id }, req.body, (err, result) => {
        if (err) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data updated Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.delete("/", verifytoken, (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      price.deleteOne({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data deleted Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", verifytoken, (req, res) => {
  try {
    const { Search } = req.query;
    if (Search) {
      price.find(
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
              token: tokengenerate({ user: req.user }),
            });
          }
        }
      );
    } else {
      price.find({}, (err, result) => {
        if (!result) {
          res.status(200).send({ message: err.message, success: false });
        } else {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            data: result,
            token: tokengenerate({ user: req.user }),
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
module.exports = router;
