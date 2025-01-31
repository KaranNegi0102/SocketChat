const UserSchema = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserSchema({ name, email, password: hashedPassword, socketId:""});
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const userId = req.user.id;
  try {
    // Find the current user
    const currentUser = await UserSchema.findById(userId).populate("friends");

    // Exclude current user and their friends from the list
    const users = await UserSchema.find({
      _id: { $ne: userId, $nin: currentUser.friends.map((friend) => friend._id) },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getFriends = async(req,res)=>{
  try{
    const userId = req.user.id;
    const user = await UserSchema.findById(userId).populate('friends',"name");
    if(!user){
      res.status(404).json({message:"User not found"});
    }
    res.status(200).json(user.friends);

  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Server error",error:err.message});

  }
}

const removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  try {
    // Find both users
    const user = await UserSchema.findById(userId);
    const friend = await UserSchema.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove friend from both users' lists
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    // Emit event to the removed friend (if they are online)
    if (friend.socketId) {
      io.to(friend.socketId).emit("friendRemoved", { removedBy: userId });
    }

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





module.exports = { registerController, loginController , getAllUsers, getFriends, removeFriend};