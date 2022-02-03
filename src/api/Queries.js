const express = require("express");
const router = express.Router();
const queries = require("../models/Queries");
const { verifyadmintoken, verifytoken } = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, mobile, email, way_to_use, message } =
      req.body;

    if (
      !(first_name && last_name && mobile && email && way_to_use && message)
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      req.body.mobile = parseInt(req.body.mobile);
      req.body.status = "Pending";
      const Queries = new queries(req.body);
      Queries.save().then((item) => {
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
router.put("/:id", verifytoken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      queries.findone({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data not exist", success: false });
        } else {
          queries.updateOne({ _id: id }, req.body, (err, result) => {
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
      queries.find({ _id: id }, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data not exist", success: false });
        } else {
          queries.deleteOne({ _id: id }, (err, result) => {
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
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});
router.get("/", async (req, res) => {
  try {
    if (req.query) {
      queries.find(req.query, (err, result) => {
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
      queries.find({}, (err, result) => {
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
