const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Import routes
const authRoutes = require('./routes/auth');
const fs = require('fs');

// Load data files
const subjects = JSON.parse(fs.readFileSync('./data/subjects.json'));
const quizzes = JSON.parse(fs.readFileSync('./data/quizzes.json'));

// Use routes
app.use(authRoutes);

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// Subject route
app.get('/subject/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const subject = subjects.subjects.find(s => s.id == req.params.id);
  res.json(subject);
});

// Quiz route
app.get('/quiz/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const quiz = quizzes.quizzes.find(q => q.subjectId == req.params.id);
  res.json(quiz);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});