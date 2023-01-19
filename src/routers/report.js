const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const LabUser = require("../models/labUser");
const User = require("../models/user");
const labAuth = require("../middleware/labAuth");
const multer = require("multer");
const sharp = require("sharp");
const Report = require("../models/report");
const auth = require("../middleware/auth");

const upload = multer({
  limits: {
    fileSize: 3000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Please upload a PDF file"));
    }
    cb(undefined, true);

    // cb(new Error("File must be pdf"));
    // cb(undefined, true);
    // cb(undefined,false)
  },
});

router.post(
  "/report/LabSend/:identityNumber/report",
  labAuth,
  upload.single("report"),
  async (req, res) => {
    // req.user.avatar = buffer;
    // await req.user.save();
    // res.send(req.user.avatar);
    try {
      const buffer = await req.file.buffer;

      const report = new Report({
        report: buffer,
        ownerL: req.user._id,
        identityNumber: req.params.identityNumber,
      });
      await report.save();
      res.send({ report: report });
    } catch (e) {
      res.status(400).send();
    }
  },

  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/labUsers/me/avatar", labAuth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/report", auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      identityNumber: req.user.identityNumber,
    });
    // console.log(report);
    if (!report) {
      throw new Error();
    }

    res.set("Content-Type", "application/pdf");

    // res.set("Content-Type", "file/pdf");
    res.send(report.report);
  } catch (e) {
    res.status(404).send();
  }
});
module.exports = router;
