const jwt = require("jsonwebtoken");
const LabUser = require("../models/labUser");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisme new course");
    console.log(decoded._id);
    const user = await LabUser.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // console.log(user);

    if (!user) {
      throw new Error("user auth faild");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
