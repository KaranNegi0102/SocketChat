const Message = require('../model/MessageModel');

const sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = new Message({ sender: senderId, receiver: receiverId, message });
    await newMessage.save();

    // Emit the message to the receiver using Socket.IO
    const io = req.app.get('socketio');
    io.to(receiverId).emit('receiveMessage', newMessage);

    res.status(201).json({ message: 'Message sent', newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = { sendMessage, getChatHistory };