const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // Assuming you have an Express app
const PORT = 5000;
const UserSchema = require("./model/UserModel");
const server = http.createServer(app);

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
        console.log(`Socket ID updated for user -> ${userId}, Socket ID: ${socket.id}`);
      }
      catch (err) {
      console.log("Error updating user ->", err);
    }
  });

  // socket.on('logout', async (userId) => {
    
  // });

  socket.on("login", async (userId) => {
    try {
      const user = await UserSchema.findByIdAndUpdate(
        userId,
        { socketId: socket.id ,isOnline:true },
        { new: true } // Return updated user
      );
      if(user){
        console.log(`User ${userId} is now online.`);
        console.log("this is user from login ",user)
        user.friends.forEach((friendId)=>{
          console.log(friendId)
          console.log(`emiited to ${friendId} that user ${userId} is now online.`);
          io.to(friendId).emit("friend-online",userId);
        })
      }
        console.log(`Socket ID updated for user -> ${userId}, Socket ID: ${socket.id}`);
      }
     catch (err) {
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
    if (response === "accept") {
      io.to(users[receiverId]).emit("acceptRequest", { senderId: socket.id });
    } else if (response === "reject") {
      io.to(users[receiverId]).emit("rejectRequest", { senderId: socket.id });
    }

    console.log(`Request response from ${senderId} to ${receiverId}: ${response}`);
  });


  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const receiver = await UserSchema.findById(receiverId);

    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("receiveMessage", {
        senderId,
        text,
      });
      console.log(`Message ${text} sent from ${senderId} to ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} is not connected.`);
    }
  });

  // Handle user disconnection
  socket.on("disconnect",async  () => {
    console.log("A user disconnected:", socket.id);
    try {
      const user = await UserSchema.findOneAndUpdate(
        { socketId: socket.id },
        { isOnline: false, socketId: null },
        { new: true }
      );

      // if (user) {
      //   console.log(`User ${user._id} is now offline.`);

      //   // Notify friends that the user is offline
      //   user.friends.forEach((friendId) => {
      //     io.to(friendId).emit("friend-offline", user._id);
      //   });
      }
     catch (err) {
      console.error("Error updating user disconnection:", err);
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});