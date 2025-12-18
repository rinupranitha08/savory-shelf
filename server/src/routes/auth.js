const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { body: req.body });
    const { name, email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Checking for existing user with email:', email);
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists');
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.log('Hashing password');
    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log('Creating user');
    const user = await User.create({ name: name || '', email, passwordHash });

    console.log('Generating token');
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    console.log('Signup successful for:', email);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Generating token');
    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    console.log('Login successful for:', email);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
