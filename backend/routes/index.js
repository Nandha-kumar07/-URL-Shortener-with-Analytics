const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

// @route   GET /:shortId
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortId', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (url) {
      // Record visit analytics
      const visitData = {
        timestamp: new Date(),
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      };

      url.clicks += 1;
      url.visitHistory.push(visitData);
      
      // Keep only last 100 visits if we want to limit array size, or let it grow
      // For a real app, storing large arrays in documents is bad, but for hackathon it's fine.

      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;
