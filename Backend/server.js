const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./db/connection");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/upload/img", express.static(path.join(__dirname, "upload/img")));
app.use("/upload/logos", express.static(path.join(__dirname, "upload/logos")));
app.use(
  "/upload/resume",
  express.static(path.join(__dirname, "upload/resume"))
);
app.use(cors());
app.use("/auth", require("./Routes/Router"));
connectDB();
app.get("/", (req, res) => {
  res.send("Hi I am running");
});

app.listen(port, (req, res) => {
  console.log(`server is running ${port}`);
});
