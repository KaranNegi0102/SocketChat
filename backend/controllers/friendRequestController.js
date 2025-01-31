const FriendRequest = require("../model/FriendRequestModel");
const UserSchema = require("../model/UserModel");
const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Create new friend request
    const newRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find and update the request status
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    // Add each user to the other's friends list
    await UserSchema.findByIdAndUpdate(request.sender, { $push: { friends: request.receiver } });
    await UserSchema.findByIdAndUpdate(request.receiver, { $push: { friends: request.sender } });

    res.status(200).json({ message: 'Friend request accepted', request });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find and update the request status
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Friend request rejected', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const requests = await FriendRequest.find({ receiver: userId, status: 'pending' }).populate('sender', 'name');
    console.log("this is requests in controller -> ", requests);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { sendFriendRequest , acceptFriendRequest , rejectFriendRequest , getPendingRequests };