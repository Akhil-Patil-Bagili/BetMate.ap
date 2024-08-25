// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { validateToken } = require('../middleware/authMiddleware');

// Route to fetch stored matches from the database
router.get('/', validateToken, matchController.matches);

// Route to fetch a specific match by its ID
router.get('/:id', validateToken, matchController.getMatchById);

// Route to manually trigger fetching and updating matches from the Cricbuzz API
router.post('/fetch-updates', validateToken, async (req, res) => {
  try {
    await matchController.fetchAndUpdateMatches();
    res.status(200).json({ message: 'Matches fetched and updated successfully.' });
  } catch (error) {
    console.error('Error fetching and updating matches:', error);
    res.status(500).json({ message: 'Failed to fetch and update matches.', error: error.message });
  }
});

module.exports = router;
