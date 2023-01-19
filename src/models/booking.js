const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { list } = require("mongodb/lib/gridfs/grid_store");

const Booking = new mongoose.model("Booking", {
  test: {
    type: Array,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
    trim: true,
  },

  time: {
    type: String,
    required: true,
    trim: true,
  },

  serviceLoc: {
    type: String,
    required: true,
    trim: true,
  },
  check: {
    type: String,
    required: true,
    trim: true,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ownerL: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerLabName: {
    type: String,
    required: true,
  },
});

module.exports = Booking;
