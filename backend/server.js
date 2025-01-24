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
  socket.on("sendFriendRequest", async ({receiverId, senderId}) => {
    const receiver = await UserSchema.findById(receiverId);  // Get the recipient's socket ID
    if (receiver) {
      
      io.to(receiver.socketId).emit("newFriendRequest", { senderId: socket.id });

      console.log(`Request sent from ${senderId} to ${receiverId}`);
    } else {
      console.log(`User ${toUserId} is not connected`);
      socket.emit("requestError", `User ${toUserId} is not connected.`);
    }
  });

  // Handle request responses (accept/reject)
  socket.on("respondToRequest", ({ senderId ,receiverId, response }) => {
    
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