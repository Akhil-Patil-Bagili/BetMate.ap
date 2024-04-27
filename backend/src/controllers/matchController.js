const axios = require('axios');
const prisma = require('../prismaClient');
require('dotenv').config();

exports.fetchMatches = async () => {
  try {
    const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/schedule/v1/league', {
      headers: {
        'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    });

    const matches = response.data.matchScheduleMap.flatMap(schedule =>
      schedule.scheduleAdWrapper?.matchScheduleList.flatMap(event =>
        event.seriesName === "Indian Premier League 2024" ? event.matchInfo.map(match => ({
          date: new Date(parseInt(match.startDate)),
          team1: match.team1.teamSName,
          team2: match.team2.teamSName,
          matchDescription: match.matchDesc,
          location: `${match.venueInfo.ground}, ${match.venueInfo.city}, ${match.venueInfo.country}`,
          matchType: match.matchFormat,
          seriesName: event.seriesName
        })) : []
      )
    ).filter(match => match);

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
    console.error('Error fetching or storing matches:', error);
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
      orderBy: { date: 'asc' }
    });
    res.json(matches);
  } catch (error) {
    console.error('Error retrieving matches:', error);
    res.status(500).json({ message: "Failed to retrieve matches", error: error.message });
  }
};
