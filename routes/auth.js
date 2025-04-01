const express = require('express');
const router = express.Router();
const path = require('path');

// Temporary user storage
let users = [];

// Register route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).send('Username already exists');
  }

  users.push({ username, password });
  req.session.user = username;
  res.redirect('/dashboard');
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  req.session.user = username;
  res.redirect('/dashboard');
});

// Logout route
router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;