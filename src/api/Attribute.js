const express = require("express");
const router = express.Router();
const { attribute, value } = require("../models/Attribute");

router.post("/", async (req, res) => {
  try {
    const { Attribute } = req.body;
    if (!Attribute) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      attribute.findOne({ attribute: Attribute }, (err, result) => {
        if (result) {
          res
            .status(200)
            .send({ message: "Attribute ALready exist", success: false });
        } else {
          const Attr = new attribute({ attribute: Attribute });
          Attr.save().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});

router.post("/value", async (req, res) => {
  try {
    attribute.findOne({ _id: req.body.attribute }, async (err, result) => {
      if (result) {
        value.findOne(req.body, async (err, result) => {
          if (!result) {
            const Value = await new value(req.body);
            Value.save().then((item) => {
              res.status(200).send({
                message: "Data save into Database",
                data: item,
                success: true,
              });
            });
          } else {
            res
              .status(200)
              .send({ message: "Data ALready exist", success: false });
          }
        });
      } else {
        res.status(200).send({ message: "Invalid Attribute", success: false });
      }
    });
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});
router.get("/value", async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      value.find({ attribute: id }, (err, result) => {
        if (result) {
          res.status(200).send({
            message: "Data get Successfully",
            data: result,
            success: true,
          });
        }else{
          res.status(200).send({ message: "Data Not Exist", success: false });
        }
      });
    } else {
      value.find({}, (err, result) => {
        if (result) {
          res.status(200).send({
            message: "Data get Successfully",
            data: result,
            success: true,
          });
        }else{
          res.status(200).send({ message: "Data Not Exist", success: false });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.query) {
      attribute.find(req.query, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data Not Exist", success: false });
        } else {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            data: result,
          });
        }
      });
    } else {
      attribute.find({}, (err, result) => {
        if (!result) {
          res.status(200).send({ message: "Data Not Exist", success: false });
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
    res.send({ message: err.message, success: false });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      attribute.findOne({ _id: id }, (err, result) => {
        if (result) {
          attribute.updateOne({ _id: id }, req.body, (err, result) => {
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
          res.status(200).send({ message: "Data Not Exist", success: false });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});
router.delete("/", async (req, res) => {
  try {
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
          res.status(200).send({ message: "Data Not Exist", success: false });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});

router.put("/value/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      value.findOne({ _id: id }, (err, result) => {
        if (result) {
          value.updateOne({ _id: id }, req.body, (err, result) => {
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
          res.status(200).send({ message: "Data not exist", success: false });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});
router.delete("/value", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      value.findOne({ _id: id }, (err, result) => {
        if (result) {
          value.deleteOne({ _id: id }, (err, result) => {
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
          res.status(200).send({ message: "Data Not Exist", success: false });
        }
      });
    }
  } catch (err) {
    res.send({ message: err.message, success: false });
  }
});

module.exports = router;
