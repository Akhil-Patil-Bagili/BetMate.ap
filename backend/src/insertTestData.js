const prisma = require('./prismaClient');

async function insertTestMatches() {
  await prisma.match.createMany({
    data: [
      {
        id: 89651, // Unique matchId from the API
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
        id: 89652, // Unique matchId from the API
        date: new Date('2024-08-26T14:00:00.000Z'),
        team1: 'DC',
        team2: 'GT',
        matchDescription: 'Test Match 2',
        location: 'Delhi',
        matchType: 'T20',
        seriesName: 'Indian Premier League 2024',
        state: 'scheduled',
        status: 'Scheduled',
        winner: 'unknown',
      },
      {
        id: 89653, // Unique matchId from the API
        date: new Date('2024-08-27T14:00:00.000Z'),
        team1: 'RCB',
        team2: 'SRH',
        matchDescription: 'Test Match 3',
        location: 'Bangalore',
        matchType: 'T20',
        seriesName: 'Indian Premier League 2024',
        state: 'scheduled',
        status: 'Scheduled',
        winner: 'unknown',
      },
      {
        id: 89654, // Unique matchId from the API
        date: new Date('2024-08-27T14:00:00.000Z'),
        team1: 'KKR',
        team2: 'LSG',
        matchDescription: 'Test Match 4',
        location: 'Kolkata',
        matchType: 'T20',
        seriesName: 'Indian Premier League 2024',
        state: 'scheduled',
        status: 'Scheduled',
        winner: 'unknown',
      },
      {
        id: 89655, // Unique matchId from the API
        date: new Date('2024-08-28T14:00:00.000Z'),
        team1: 'PBKS',
        team2: 'MI',
        matchDescription: 'Test Match 5',
        location: 'Mumbai',
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
