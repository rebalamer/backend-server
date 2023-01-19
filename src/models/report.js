const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { list } = require("mongodb/lib/gridfs/grid_store");

const Report = new mongoose.model("Report", {
  report: {
    type: Buffer,
    required: true,
  },
  ownerL: {
    type: String,
    required: true,
    trim: true,
  },
  identityNumber: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = Report;
