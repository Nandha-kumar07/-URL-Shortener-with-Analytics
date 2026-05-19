const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../utils/supabase');

let nanoid;
(async () => {
  const m = await import('nanoid');
  nanoid = m.nanoid;
})();

function isValidUrl(string) {
  try { new URL(string); return true; } catch (e) { return false; }
}

const mapUrl = (u) => ({
  _id: u.id,
  shortId: u.short_id,
  originalUrl: u.original_url,
  clicks: u.clicks,
  createdAt: u.created_at,
  expiresAt: u.expires_at
});

// @route   POST api/url/shorten
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ msg: 'Invalid URL format' });
  }

  try {
    let shortId;
    if (customAlias) {
      const { data: existing } = await supabase
        .from('urls')
        .select('id')
        .eq('short_id', customAlias)
        .single();

      if (existing) return res.status(400).json({ msg: 'Custom alias already in use' });
      shortId = customAlias;
    } else {
      if (!nanoid) { const m = await import('nanoid'); nanoid = m.nanoid; }
      shortId = nanoid(8);
    }

    const { data: url, error } = await supabase
      .from('urls')
      .insert({ 
        user_id: req.user.id, 
        original_url: originalUrl, 
        short_id: shortId,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    res.json(mapUrl(url));
  } catch (err) {
    console.error('Shorten error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/url  - Get all URLs for the user
router.get('/', auth, async (req, res) => {
  try {
    const { data: urls, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    res.json(urls.map(mapUrl));
  } catch (err) {
    console.error('Get URLs error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/url/:shortId/analytics
router.get('/:shortId/analytics', auth, async (req, res) => {
  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_id', req.params.shortId)
      .eq('user_id', req.user.id)
      .single();

    if (error || !url) return res.status(404).json({ msg: 'URL not found or unauthorized' });

    // Get visit history
    const { data: visits } = await supabase
      .from('visits')
      .select('*')
      .eq('url_id', url.id)
      .order('timestamp', { ascending: false })
      .limit(100);

    res.json({ ...mapUrl(url), visitHistory: visits || [] });
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/url/:shortId
router.delete('/:shortId', auth, async (req, res) => {
  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('id')
      .eq('short_id', req.params.shortId)
      .eq('user_id', req.user.id)
      .single();

    if (error || !url) return res.status(404).json({ msg: 'URL not found or unauthorized' });

    await supabase.from('visits').delete().eq('url_id', url.id);
    await supabase.from('urls').delete().eq('id', url.id);

    res.json({ msg: 'URL removed' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
