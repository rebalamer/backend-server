const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('password cannot contain "password"');
      }
    },
  },

  phoneNumber: {
    type: String,
    validate(value) {
      if (!validator.isNumeric(value)) {
        throw new Error("Invalid supscription number is invalid");
      }
    },
  },

  bTime: {
    type: String,
    required: true,
    trim: true,
  },
  eTime: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  insurance: {
    type: Array,
    required: true,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// userSchema.virtual("myServices", {
//   ref: "Service",
//   localField: "_id",
//   foreignField: "owner",
// });

userSchema.virtual("labBookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "ownerL",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisme new course");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await LabUser.findOne({ username });

  if (!user) {
    throw new Error("unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login ");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  Problem.deleteMany({
    owner: user._id,
  });

  next();
});

const LabUser = mongoose.model("LabUser", userSchema);

module.exports = LabUser;
