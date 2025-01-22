const express = require("express");
const cors = require("cors");
const  connectDB  = require("./connection/connectDb");

const app = express();

connectDB();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Socket.io Chat Backend is Running!");
});


app.use("/api/user", require("./routes/userRoutes"));


module.exports = app;
