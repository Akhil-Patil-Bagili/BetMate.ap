// src/cronJobs.js

const cron = require('node-cron');
const matchController = require('./controllers/matchController');

// Schedule to fetch upcoming matches every night at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Fetching upcoming matches...');
    await matchController.fetchAndUpdateMatches(); // Fetch and store upcoming matches
});


module.exports = cron;
