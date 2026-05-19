const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Test Supabase connection on startup
const supabase = require('./utils/supabase');
supabase.from('users').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected successfully!');
    }
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/url', require('./routes/url'));
app.use('/', require('./routes/index'));

// Serve Frontend in Production (For AWS EC2 single-server deployment)
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve the React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
