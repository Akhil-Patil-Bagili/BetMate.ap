const axios = require('axios');
const prisma = require('../prismaClient');
require('dotenv').config();

// Function to fetch matches from the API and store them in the database
exports.fetchMatches = async () => {
  try {
    // Fetching data from the external cricket API
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/league', {
      headers: {
        'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    });

    console.log('API Response Data:', response.data);

    // Parse the response to format it for database insertion
    const matches = response.data.matchScheduleMap.flatMap(schedule =>
      schedule.scheduleAdWrapper?.matchScheduleList.flatMap(event =>
        event.seriesName === "Indian Premier League 2024" ? event.matchInfo.map(match => ({
          date: new Date(parseInt(match.startDate)),
          team1: match.team1.teamName,
          team2: match.team2.teamName,
          location: match.venueInfo.city + ", " + match.venueInfo.country,
          matchType: match.matchFormat,
          seriesName: event.seriesName
        })) : []
      )
    ).filter(match => match !== undefined && match.team1 && match.team2);  // Additional filtering to remove any undefined or incomplete entries

    console.log('Filtered and Parsed Matches:', matches); // Log the filtered parsed matches for verification

    // Check if there are matches to store
    if (matches.length > 0) {
      // Store the parsed matches in the database
      const result = await prisma.match.createMany({
        data: matches,
        skipDuplicates: true
      });
      console.log('Matches fetched and stored successfully:', result);
    } else {
      console.log('No matches found to store');
    }
  } catch (error) {
    console.error('Failed to fetch matches:', error);
  }
};

// Function to retrieve matches from the database and send them as a response
exports.matches = async (req, res) => {
  try {
    console.log('Fetching matches from database...');
    const now = new Date();
    console.log('Current Date for Query:', now);
    const matches = await prisma.match.findMany({
      where: { 
        date: { gte: now },
        seriesName: "Indian Premier League 2024" // Ensure only IPL 2024 matches are queried
      }, 
      orderBy: { date: 'asc' }
    });

    console.log('Retrieved Matches:', matches); // Log the matches retrieved from the database
    res.json(matches);
  } catch (error) {
    console.error('Failed to retrieve matches:', error);
    res.status(500).json({ message: "Failed to retrieve matches", error: error.message });
  }
};
