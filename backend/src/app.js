// src/app.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const betRoutes = require('./routes/betRoutes');
const friendRoutes = require('./routes/friendRoutes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/matches',matchRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/friends', friendRoutes);

module.exports = app;

