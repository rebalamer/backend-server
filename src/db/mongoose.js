const mongoose = require("mongoose");

const URI =
  "mongodb+srv://rebalamer:rebal123456789@cluster0.wdqgekh.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: false,
  });

  console.log("db connected ");
};

module.exports = connectDB;
