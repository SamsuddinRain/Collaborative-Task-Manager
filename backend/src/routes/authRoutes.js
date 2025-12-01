const express = require('express');
const router = express.Router();
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/authMiddleware');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check existing email
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'manager' ? 'manager' : 'user'
    });

    return res.json({
      token: generateToken(user.id, user.role),
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      token: generateToken(user.id, user.role),
      user
    });

  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// PROFILE (me)
router.get('/me', protect, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
});

module.exports = router;
