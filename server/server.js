const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
// connect .env
require("dotenv").config();

const http = require("http");
const path = require("path");

// app initialize

const app = express();

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  };

// connect database
mongoose
  .connect(process.env.DATABASE, {
    useNewURLParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("connection error", err));

//   middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);
app.use(cors());
app.use(allowCrossDomain);

// routes middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));


// server
const httpServer = http.createServer(app);
const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log(`server is running on ${port}`);
});