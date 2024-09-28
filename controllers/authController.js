const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load the private key from the environment variable (or from a file if you're using key files)
const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');

// Generate JWT
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, privateKey, {
    algorithm: 'RS256', // Use RS256 to sign the token with the private key
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,  // Long-lived refresh token
  });
};


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the new user
    const user = await User.create({ username, email, password });

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send refresh token as an httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,    // Prevent JavaScript access
      secure: true,      // HTTPS only in production
      sameSite: 'Strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send the access token in the response body
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: accessToken,  // Access token sent in the response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// Login user and issue tokens
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Send refresh token as an httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,   // Prevent access from JavaScript
        secure: true,     // Ensure cookie is only sent over HTTPS
        sameSite: 'Strict', // Protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      // Send the access token in the response body
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh access token using refresh token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;  // Retrieve the refresh token from the cookie

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'), { algorithms: ['RS256'] });

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user);

    // Send the new access token
    res.json({ token: accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout user and invalidate the refresh token
exports.logoutUser = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out successfully' });
};
