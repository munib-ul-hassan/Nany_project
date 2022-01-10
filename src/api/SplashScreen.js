const express = require("express");
const router = express.Router();
const splashscreen = require("../models/SplashScreen");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/splashscreen/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

var upload = multer({ storage: storage });

router.post("/", upload.array("file"), (req, res) => {
    try {
        if (req.files.length > 0) {
            req.body.image = req.files[0].path
            const Splashscreen = new splashscreen(req.body);
            Splashscreen.save().then((item) => {
                res.status(200).send({
                    message: "Data save into Database",
                    data: item,
                    success: true,
                });
            });
        } else {
            res.status(200).json({ message: "first input image", success: false });

        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
router.put("/:id", upload.array("file"), (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(200).send({ message: "id is not specify", success: false });
        } else {
            splashscreen.findOne({ _id: id }, req.body, (err, result) => {
                fs.unlink(result.image, () => { })
                req.body.image = req.files[0].path
                splashscreen.updateOne({ _id: id }, req.body, (err, result) => {
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
            })

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
            splashscreen.findOne({ _id: id }, (err, result) => {
                fs.unlink(result.image, () => { })
                splashscreen.deleteOne({ _id: id }, (err, result) => {
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

            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
router.get("/", (req, res) => {
    try {
        splashscreen.find(
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

    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
});
module.exports = router;
