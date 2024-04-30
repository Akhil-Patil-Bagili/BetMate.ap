const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const betRoutes = require('./routes/betRoutes');
const friendRoutes = require('./routes/friendRoutes');

const app = express();

// Configure CORS to accept credentials and from your frontend origin
app.use(cors({
    origin: 'http://localhost:5173', // adjust this to your frontend's URL
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // Add this line to use cookie parser

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/friends', friendRoutes);

module.exports = app;
