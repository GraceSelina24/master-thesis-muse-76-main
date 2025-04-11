const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from the public directory (accessible as http://localhost:3001/images/...)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Log all API requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Auth middleware
// ... rest of the code 