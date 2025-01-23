const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // Assuming you have an Express app
const PORT = 5000;

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
  socket.on("register", (userId) => {
    if (users[userId]) {
      console.log(`User ${userId} is already registered.`);
      socket.emit("registrationError", "User ID is already in use.");
    } else {
      users[userId] = socket.id; // Map userId to socket.id
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
      socket.emit("registrationSuccess", "Registration successful!");
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
    // Remove the user from the users object
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User ${userId} removed`);
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});