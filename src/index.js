const express = require("express");
require("./db/mongoose");
const connectDB = require("./db/mongoose");
const cors = require("cors");
const BookingRouter = require("./routers/booking");
const LabUserRouter = require("./routers/labUser");
const UserRouter = require("./routers/user");
const ReportRouter = require("./routers/report");

const app = express();
app.use(cors());

connectDB();

const port = process.env.PORT || 3030;

const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a Word document"));
    }
    cb(undefined, true);

    // cb(new Error("File must be pdf"));
    // cb(undefined, true);
    // cb(undefined,false)
  },
});

app.use(express.json());
app.use(BookingRouter);
app.use(LabUserRouter);
app.use(UserRouter);
app.use(ReportRouter);

app.listen(port, () => {
  console.log("server is up on port " + port);
});
