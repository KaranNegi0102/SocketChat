const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageControlle');
const authMiddleware = require('../middlewares/authMiddleware');


// Send a message
router.post('/send-message', authMiddleware ,messageController.sendMessage);

// Get chat history with a friend
router.get('/chat-history/:friendId', authMiddleware ,messageController.getChatHistory);

module.exports = router;