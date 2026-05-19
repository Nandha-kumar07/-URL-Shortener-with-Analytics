const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), password: hashedPassword })
      .select('id, email')
      .single();

    if (error) throw new Error(error.message);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
    res.json({ token });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth/login
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw new Error(error.message);
    res.json(user);
  } catch (err) {
    console.error('Me error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
