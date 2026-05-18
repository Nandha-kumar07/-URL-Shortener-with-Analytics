const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Url = require('../models/Url');
const { check, validationResult } = require('express-validator');

let nanoid;

// We need to dynamically import nanoid because it's an ES module in newer versions
// Alternatively, we use nanoid 5 which we installed. Wait, nanoid 5 is an ES module.
// So we use dynamic import.
(async () => {
  const m = await import('nanoid');
  nanoid = m.nanoid;
})();

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// @route   POST api/url/shorten
// @desc    Create short URL
// @access  Private
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customAlias } = req.body;
  
  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ msg: 'Invalid URL format' });
  }

  try {
    let shortId;
    if (customAlias) {
      const existing = await Url.findOne({ shortId: customAlias });
      if (existing) {
        return res.status(400).json({ msg: 'Custom alias already in use' });
      }
      shortId = customAlias;
    } else {
      // make sure nanoid is loaded
      if (!nanoid) {
        const m = await import('nanoid');
        nanoid = m.nanoid;
      }
      shortId = nanoid(8);
    }

    const newUrl = new Url({
      userId: req.user.id,
      originalUrl,
      shortId
    });

    await newUrl.save();
    
    // We can format response if we want, like returning the full shortened URL
    res.json(newUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/url
// @desc    Get all URLs for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/url/:shortId/analytics
// @desc    Get analytics for a specific URL
// @access  Private
router.get('/:shortId/analytics', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ msg: 'URL not found or unauthorized' });
    }
    res.json(url);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/url/:shortId
// @desc    Delete a URL
// @access  Private
router.delete('/:shortId', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId, userId: req.user.id });
    if (!url) {
      return res.status(404).json({ msg: 'URL not found or unauthorized' });
    }
    await Url.deleteOne({ _id: url._id });
    res.json({ msg: 'URL removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
