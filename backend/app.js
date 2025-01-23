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


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/friend-requests", require("./routes/friendRequestRoute"));


module.exports = app;
