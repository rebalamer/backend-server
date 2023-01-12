const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/booking");
const { populate } = require("../models/user");
const User = require("../models/user");
const labAuth = require("../middleware/labAuth");
const LabUser = require("../models/labUser");

router.post("/bookings/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const labUser = await LabUser.findOne({ _id });
  console.log(labUser);
  const booking = new Booking({
    ...req.body,
    owner: req.user._id,
    ownerL: _id,
    ownerName: req.user.name,
    ownerLabName: labUser.name,
  });
  try {
    console.log(booking);

    await booking.save();
    // sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ booking: booking });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/myBookings", auth, async (req, res) => {
  try {
    await req.user.populate("bookings");
    if (req.user.bookings == "") {
      res.status(404).send();
    }

    res.send(req.user.bookings);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/labUserBookings", labAuth, async (req, res) => {
  try {
    await req.user.populate("labBookings");
    if (req.user.labBookings == "") {
      res.status(404).send();
    }

    res.send(req.user.labBookings);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/bookings/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const booking = await Booking.findOne({ _id, owner: req.user._id });

    if (!booking) {
      return res.status(404).send();
    }

    res.send(booking);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/bookings/update/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["test", "date", "time", "serviceLoc"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!booking) {
      return res.status(404).send();
    }

    updates.forEach((update) => (booking[update] = req.body[update]));
    await booking.save();
    res.send(booking);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/bookings/delete/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!booking) {
      res.status(404).send();
    }

    res.send(booking);
  } catch (e) {
    res.status(500).send();
  }
});
router.get("/allBookings", async (req, res) => {
  try {
    const booking = await Booking.find({});
    res.send(booking);
  } catch (e) {
    res.status(500).send;
  }
});

// router.patch("/bookings/update/:id",auth ,  async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["test", "date", "time", "serviceLoc"];
//   const isValidOperation = updates.every((update) => {
//     return allowedUpdates.includes(update);
//   });
//   if (!isValidOperation) {
//     return res.status(404).send();
//   }
//   try {
//     const booking = await Booking.findOneAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!booking) {
//       return res.status(404).send();
//     }
//     res.send(booking);
//   } catch (e) {}
// });

// router.get("/problems", auth, async (req, res) => {
//   try {
//     await req.user.populate("myProblems").execPopulate();
//     res.send(req.user.myProblems);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.get("/allproblems", async (req, res) => {
//   try {
//     const problems = await Problem.find({});

//     const count = problems.length;
//     var i;
//     for (i = 0; i < count; i++) {
//       await problems[i].populate("owner").execPopulate();
//       problems[i].ownerName = problems[i].owner.name;
//     }

//     res.send(problems);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.get("/problems/:id", auth, async (req, res) => {
//   try {
//     const problem = await Problem.findOne({
//       _id: req.params.id,
//       owner: req.user._id,
//     });
//     if (!problem) {
//       return res.status(404).send();
//     }

//     res.send(problem);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.get("/adminProblemId/:id", async (req, res) => {
//   try {
//     const problem = await Problem.findOne({
//       _id: req.params.id,
//     });
//     if (!problem) {
//       return res.status(404).send();
//     }

//     res.send(problem);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.delete("/problems/:id", async (req, res) => {
//   try {
//     const problem = await Problem.findOneAndDelete({
//       _id: req.params.id,
//       // owner: req.user._id,
//     });
//     if (!problem) {
//       return res.status(404).send();
//     }
//     res.send(problem);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

module.exports = router;
