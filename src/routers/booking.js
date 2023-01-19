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

  const book = await Booking.findOne({
    date: req.body.date,
    time: req.body.time,
    ownerL: _id,
  });
  console.log(book);
  const booking = new Booking({
    ...req.body,
    owner: req.user._id,
    ownerL: _id,
    ownerName: req.user.name,
    ownerLabName: labUser.name,
  });
  try {
    console.log(booking);
    if (!book) {
      await booking.save();
      res.status(201).send({ booking: booking });
    } else res.status(400).send("The appointment is booked ");

    // sendWelcomeEmail(user.email, user.name);
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

// router.get("/labUserBookingsByDate", labAuth, async (req, res) => {

//   const bookings = Booking.fndMany(req.body.)
//   try {
//     await req.user.populate("labBookings");
//     if (req.user.labBookings == "") {
//       res.status(404).send();
//     }

//     res.send(req.user.labBookings);
//   } catch (e) {
//     res.status(500).send();
//   }
// });
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

router.get("/bookingsByDate/:date", labAuth, async (req, res) => {
  // console.log(req.body);
  // const date = req.body.date;
  // console.log(date);

  try {
    const booking = await Booking.find({
      date: req.params.date,
      ownerL: req.user._id,
    });
    console.log(booking);
    if (booking == 0) {
      return res.status(404).send();
    }
    res.send(booking);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/bookings/update/:id", auth, async (req, res) => {
  // const book = await Booking.findOne({
  //   date: req.body.date,
  //   time: req.body.time,
  //   ownerL: req.body.ownerL,
  // });
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

router.patch("/bookings/updateCheck/:id", labAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["check", "test", "date", "time", "serviceLoc"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      ownerL: req.user._id,
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

module.exports = router;
