const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// @route   GET /:shortId
// @desc    Redirect to original URL
router.get('/:shortId', async (req, res) => {
  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_id', req.params.shortId)
      .single();

    if (error || !url) {
      return res.status(404).json({ msg: 'No URL found' });
    }

    // Check expiration
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #ff4444;">Link Expired</h1>
          <p>This short link has reached its expiration date and is no longer active.</p>
        </div>
      `);
    }

    // Record visit
    const visitData = {
      url_id: url.id,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      user_agent: req.headers['user-agent']
    };

    // Increment clicks and record visit in parallel
    await Promise.all([
      supabase.from('urls').update({ clicks: url.clicks + 1 }).eq('id', url.id),
      supabase.from('visits').insert(visitData)
    ]);

    return res.redirect(url.original_url);
  } catch (err) {
    console.error('Redirect error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
