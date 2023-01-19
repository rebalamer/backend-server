const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const LabUser = require("../models/labUser");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

router.post("/users", async (req, res) => {
  const labUser = await LabUser.findOne({ username: req.body.username });
  console.log(labUser);

  const user = new User(req.body);
  try {
    if (labUser) {
      throw new Error("username is exist");
    }
    await user.save();

    // sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token, username: user.username });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
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

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/users/password", auth, async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.user.username,
      req.body.password
    );
    console.log(req.user.username, req.body.password);
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const labUser = await LabUser.findOne({ username: req.body.username });
  console.log(labUser);

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "identityNumber",
    "name",
    "password",
    "email",
    "phoneNumber",
    "age",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid update" });
  }

  try {
    if (labUser) {
      throw new Error("username is exist");
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
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

// router.patch("/users/update/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "name",
//     "password",
//     "email",
//     "phoneNumber",
//     "sub_Number",
//     "cunsump",
//   ];
//   const isValidOperation = updates.every((update) => {
//     return allowedUpdates.includes(update);
//   });
//   if (!isValidOperation) {
//     return res.status(404).send();
//   }
//   try {
//     const user = await User.findOneAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.send(e);
//   }
// });

// //////////////// for the admin to delete users ///////////////
// router.delete("/users/:id", async (req, res) => {
//   try {
//     // sendCancelationEmail(req.user.email, req.user.name);
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// ////////////////// for the admin to view users data ///////////////
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send;
//   }
// });

// router.patch("/usersIdentity/:identity", async (req, res) => {
//   const updates = Object.keys(req.body);
//   // console.log(updates);

//   try {
//     const user = await User.findOne(req.params.identity);
//     // console.log(user);
//     updates.forEach((update) => (user[update] = req.body[update]));
//     await req.user.save();
//     res.send(req.user);
//   } catch (e) {
//     res.status(400).send();
//   }

//   // const user = await User.findOneAndUpdate(req.params.identity, req.body);
//   // newPass = user.password;
//   // newPass = await bcrypt.hash(newPass, 8);

//   // const user2 = await User.findOneAndUpdate(req.params.identity, {
//   //   password: newPass,
//   // });

//   // // //   if (!user) {
//   // // //     return res.status(404).send();
//   // // //   }
//   // // await user2.save();
//   // res.send(user2);
//   // // } catch (e) {
//   // //   res.status(500).send;
//   // // }
// });

// router.post("/usersSendEmail/:email", async (req, res) => {
//   console.log(req.params.email);
//   let r = (Math.random() + 1).toString(36).substring(3);
//   console.log(r);
//   ForgetPassEmail(req.params.email, " انس طعمة", r);
// });

////////////////////// read all users //////////////////
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send;
  }
});
const upload = multer({
  limits: {
    fileSize: 1000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload am images png,jpg,jpeg"));
    }
    cb(undefined, true);

    // cb(new Error("File must be pdf"));
    // cb(undefined, true);
    // cb(undefined,false)
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user.avatar);
  },

  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
