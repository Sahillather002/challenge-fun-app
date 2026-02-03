const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle specific routes and fallback to index.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/competitions', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/rewards', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 Your mobile app is available!`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
  console.log(`📱 Routes: /login, /dashboard, /profile, /competitions, /rewards, /settings`);
});
