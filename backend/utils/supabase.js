if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = require('ws');
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
