const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username is required and must be at least 3 characters' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: existingUser.email === email ? 'Email already in use' : 'Username already in use' });
    }

    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Registration error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    console.log("Login successful for user:", user.username);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Login error:`, error);
    res.status(400).json({ message: 'Server error' });
  }
};

module.exports = { register, login };