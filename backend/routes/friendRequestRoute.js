const express = require('express');
const router = express.Router();
const friendRequestController = require('../controllers/friendRequestController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware to protect routes

// Send a friend request
router.post('/send-request', authMiddleware, friendRequestController.sendFriendRequest);

// Accept a friend request
router.post('/accept-request', authMiddleware, friendRequestController.acceptFriendRequest);

// Reject a friend request
router.post('/reject-request', authMiddleware, friendRequestController.rejectFriendRequest);

// Get pending friend requests
router.get('/requests', authMiddleware, friendRequestController.getPendingRequests);

module.exports = router;