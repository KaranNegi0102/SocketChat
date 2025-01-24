const express = require("express");
const router = express.Router();
const { registerController, loginController , getAllUsers, getFriends} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const UserSchema = require("../model/UserModel");

router.post("/register", registerController);
router.post("/login", loginController);
router.get('/get-users', authMiddleware,getAllUsers);
router.get('/get-friends',authMiddleware, getFriends);
router.post('/update-socket-id',authMiddleware ,async (req, res) => {
  const { socketId } = req.body;
  const userId = req.user.id; // Assuming you're using middleware to extract the user from the token

  try {
      const user = await UserSchema.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.socketId = socketId; // Update the user's socketId
      await user.save();

      res.status(200).json({ message: 'Socket ID updated successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});
router.post('/remove-socket-id',authMiddleware ,async (req, res) => {
  const userId = req.user.id; // Assuming you're using middleware to extract the user from the token

  try {
      const user = await UserSchema.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.socketId = null; // Clear the user's socketId
      await user.save();

      res.status(200).json({ message: 'Socket ID removed successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;