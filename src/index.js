const express = require("express");
require("./db/mongoose");
const connectDB = require("./db/mongoose");
const cors = require("cors");
const ProductsRouter = require("./routers/products");
const LabUserRouter = require("./routers/labUser");
const UserRouter = require("./routers/user");

const app = express();
app.use(cors());

connectDB();

const port = process.env.PORT || 3030;

app.use(express.json());
app.use(ProductsRouter);
app.use(LabUserRouter);
app.use(UserRouter);

app.listen(port, () => {
  console.log("server is up on port " + port);
});
