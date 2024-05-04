  const axios = require('axios');
  const prisma = require('../prismaClient');
  require('dotenv').config();

  exports.fetchMatches = async () => {
    try {
      const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/series/v1/7607', {
        headers: {
          'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      });
  
      console.log(JSON.stringify(response.data, null, 2));  // Consider removing or limiting this in production
  
      const matches = response.data.matchDetails.flatMap(detail => {
        return detail.matchDetailsMap && detail.matchDetailsMap.match ? detail.matchDetailsMap.match.map(match => ({
          date: new Date(parseInt(match.matchInfo.startDate)),
          team1: match.matchInfo.team1.teamSName,
          team2: match.matchInfo.team2.teamSName,
          matchDescription: match.matchInfo.matchDesc,
          location: `${match.matchInfo.venueInfo.ground}, ${match.matchInfo.venueInfo.city}`,
          matchType: match.matchInfo.matchFormat,
          seriesName: match.matchInfo.seriesName,
          state: match.matchInfo.state,
          status: match.matchInfo.status
        })) : [];
      }).filter(match => match);
  
      if (matches.length > 0) {
        const result = await prisma.match.createMany({
          data: matches,
          skipDuplicates: true
        });
        console.log('Matches stored successfully:', result);
      } else {
        console.log('No matches to store');
      }
    } catch (error) {
      console.error('Error fetching or storing matches:', error.message);
      if (error.response) {
        // Additional error details can be logged here
        console.error('Error details:', error.response.status, error.response.data);
      }
    }
  };
  
  

  exports.matches = async (req, res) => {
    try {
      const now = new Date();
      const matches = await prisma.match.findMany({
        where: { 
          date: { gte: now },
          seriesName: "Indian Premier League 2024"
        }, 
        orderBy: { date: 'asc' } // ensure this is the correct syntax
      });
      res.json(matches);
    } catch (error) {
      console.error('Error retrieving matches:', error);
      // Consider logging more error details if available
      res.status(500).json({ message: "Failed to retrieve matches", error: error.message });
    }
  };
  
