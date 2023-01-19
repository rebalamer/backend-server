const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const LabUser = require("../models/labUser");
const User = require("../models/user");
const labAuth = require("../middleware/labAuth");
const multer = require("multer");
const sharp = require("sharp");

router.post("/labUsers", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  const labUser = new LabUser(req.body);
  try {
    if (user) {
      throw new Error("username exist");
    }
    await labUser.save();
    // sendWelcomeEmail(user.email, user.name);
    const token = await labUser.generateAuthToken();
    res.status(201).send({ user: labUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/labUsers/login", async (req, res) => {
  try {
    const labUser = await LabUser.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await labUser.generateAuthToken();
    res.send({ user: labUser, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/labUsers/password", labAuth, async (req, res) => {
  try {
    const labUser = await LabUser.findByCredentials(
      req.user.username,
      req.body.password
    );
    console.log(req.user.username, req.body.password);
    res.send(labUser);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/labUsers/logout", labAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/labUsers/logoutAll", labAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/labUsers/me", labAuth, async (req, res) => {
  res.send(req.user);
});

router.patch("/labUsers/me", labAuth, async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "name",
    "password",
    "location",
    "phoneNumber",
    "bTime",
    "eTime",
    "insurance",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid update" });
  }

  try {
    if (user) {
      throw new Error("username exist");
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/labUsers/me", labAuth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

////////////////////// read all users //////////////////
router.get("/labUsers", async (req, res) => {
  try {
    const labUsers = await LabUser.find({});
    res.send(labUsers);
  } catch (e) {
    res.status(500).send;
  }
});

module.exports = router;
