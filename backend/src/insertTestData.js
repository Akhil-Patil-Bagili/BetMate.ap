const prisma = require('./prismaClient');

async function insertTestMatches() {
  await prisma.match.createMany({
    data: [
      {
        id: 89654, // Unique matchId from the API
        date: new Date('2024-08-25T14:00:00.000Z'),
        team1: 'CSK',
        team2: 'MI',
        matchDescription: 'Test Match 1',
        location: 'Chennai',
        matchType: 'T20',
        seriesName: 'Indian Premier League 2024',
        state: 'scheduled',
        status: 'Scheduled',
        winner: 'unknown',
      },
      {
        id: 89661, // Unique matchId from the API
        date: new Date('2024-08-26T14:00:00.000Z'),
        team1: 'RCB',
        team2: 'SRH',
        matchDescription: 'Test Match 2',
        location: 'Bangalore',
        matchType: 'T20',
        seriesName: 'Indian Premier League 2024',
        state: 'scheduled',
        status: 'Scheduled',
        winner: 'unknown',
      },
    ],
  });
  console.log('Test matches inserted');
  process.exit(0);
}

insertTestMatches();
