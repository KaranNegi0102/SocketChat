const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // Assuming you have an Express app
const PORT = 5000;
const UserSchema = require("./model/UserModel");
const server = http.createServer(app);

// Store connected users and their socket IDs
const users = {};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for development)
    methods: ["GET", "POST"],
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register a user with their userId
  socket.on("register", async (userId) => {
    try {
      const user = await UserSchema.findByIdAndUpdate(
        userId,
        { socketId: socket.id },
        { new: true } // Return updated user
      );
      if (user) {
        console.log(`Socket ID updated for user -> ${userId}, Socket ID: ${socket.id}`);
      } else {
        console.log(`User not found for ID -> ${userId}`);
      }
    } catch (err) {
      console.log("Error updating user ->", err);
    }
  });

  // Send a request to another user
  socket.on("sendRequest", ({ fromUserId, toUserId }) => {
    const toSocketId = users[toUserId]; // Get the recipient's socket ID
    if (toSocketId) {
      // Forward the request to the recipient
      io.to(toSocketId).emit("requestReceived", { fromUserId });
      console.log(`Request sent from ${fromUserId} to ${toUserId}`);
    } else {
      console.log(`User ${toUserId} is not connected`);
      socket.emit("requestError", `User ${toUserId} is not connected.`);
    }
  });

  // Handle request responses (accept/reject)
  socket.on("respondToRequest", ({ fromUserId, toUserId, response }) => {
    const fromSocketId = users[fromUserId]; // Get the requester's socket ID
    if (fromSocketId) {
      // Forward the response to the requester
      io.to(fromSocketId).emit("requestResponse", { toUserId, response });
      console.log(`User ${toUserId} responded to ${fromUserId} with ${response}`);
    } else {
      console.log(`User ${fromUserId} is not connected`);
      socket.emit("responseError", `User ${fromUserId} is not connected.`);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});