const express = require('express');
const { registerUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);  // Endpoint to refresh access token
router.post('/logout', protect, logoutUser);  // Endpoint to log out and invalidate refresh token

module.exports = router;
