const prisma = require('./prismaClient');

// Function to simulate the completion of one match and updating the status of only one match
async function simulateMatchCompletion() {
  // Assume we are updating only the first match

  const updatedMatches = [
    {
      id: 89651, // Unique matchId
      date: new Date('2024-08-25T14:00:00.000Z'),
      team1: 'CSK',
      team2: 'MI',
      matchDescription: 'Test Match 1',
      location: 'Chennai',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'complete', // Simulating the match completion
      status: 'Chennai Super Kings won by 6 wkts',
      winner: 'CSK'
    },
    {
      id: 89652, // The second match remains the same, no change
      date: new Date('2024-08-26T14:00:00.000Z'),
      team1: 'DC',
      team2: 'GT',
      matchDescription: 'Test Match 2',
      location: 'Delhi',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'complete',
      status: 'Delhi Capitals won by 4 wkts',
      winner: 'DC'
    },
    {
      id: 89653, // The second match remains the same, no change
      date: new Date('2024-08-27T14:00:00.000Z'),
      team1: 'RCB',
      team2: 'SRH',
      matchDescription: 'Test Match 3',
      location: 'Bangalore',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'scheduled',
      status: 'scheduled',
      winner: 'unknown'
    },
    {
      id: 89654, // The second match remains the same, no change
      date: new Date('2024-08-27T14:00:00.000Z'),
      team1: 'KKR',
      team2: 'LSG',
      matchDescription: 'Test Match 4',
      location: 'Kolkata',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'scheduled',
      status: 'Scheduled',
      winner: 'unknown'
    },
    {
      id: 89655, // The second match remains the same, no change
      date: new Date('2024-08-28T14:00:00.000Z'),
      team1: 'PBKS',
      team2: 'MI',
      matchDescription: 'Test Match 5',
      location: 'Mumbai',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'scheduled',
      status: 'Scheduled',
      winner: 'unknown'
    },
  ];

  for (const match of updatedMatches) {
    // Upsert the match record to prevent duplication and update if there are changes
    await prisma.match.upsert({
      where: {
        id: match.id, // Use matchId to identify unique matches
      },
      update: {
        date: match.date,
        team1: match.team1,
        team2: match.team2,
        matchDescription: match.matchDescription,
        location: match.location,
        matchType: match.matchType,
        seriesName: match.seriesName,
        state: match.state,
        status: match.status,
        winner: match.winner,
      },
      create: match,
    });

    // Update user scores if the match is complete
    if (match.state === 'complete') {
      await updateUserScores(match.id, match.winner);
    }
  }

  console.log('Simulation of match completion and updates done.');
  process.exit(0);
}

const updateUserScores = async (matchId, winner) => {
  try {
    console.log(`Updating scores for matchId: ${matchId} with winner: ${winner}`);

    const matchBetmates = await prisma.matchBetmate.findMany({
      where: { matchId }
    });

    if (matchBetmates.length === 0) {
      console.log(`No betmates found for matchId: ${matchId}`);
      return;
    }

    const processedPairs = new Set();

    for (const betmate of matchBetmates) {
      const userId = betmate.userId;
      const betmateId = betmate.betmateId;

      // Ensure the user-betmate pair is processed only once for this match
      if (processedPairs.has(`${userId}-${betmateId}`) || processedPairs.has(`${betmateId}-${userId}`)) {
        console.log(`Scores already updated for user-betmate pair: ${userId}-${betmateId}, skipping...`);
        continue;
      }

      console.log(`Processing betmate: ${betmate.id} - userChoice: ${betmate.userChoice}, betmateChoice: ${betmate.betmateChoice}`);

      let points = 0;
      let userStatus = "lost";
      let betmateStatus = "won";

      if (betmate.userChoice === winner) {
        points = 10;
        userStatus = "won";
        betmateStatus = "lost";
        console.log(`User ${betmate.userId} wins, awarding ${points} points.`);
      } else if (betmate.betmateChoice === winner) {
        points = -10;
        userStatus = "lost";
        betmateStatus = "won";
        console.log(`User ${betmate.userId} loses, subtracting ${Math.abs(points)} points.`);
      }
      else{
        points = 0;
        userStatus = "unknown"
        betmateStatus = "unknown"
      }

      // Update the MatchBetmate record with points and status for the user
      await prisma.matchBetmate.update({
        where: { id: betmate.id },
        data: {
          userScore: {
            increment: points,
          },
          status: userStatus,
        },
      });

      // Update the MatchBetmate record with the inverse status for the betmate
      const betmateRecord = await prisma.matchBetmate.findFirst({
        where: {
          userId: betmate.betmateId,
          matchId: betmate.matchId,
          betmateId: betmate.userId
        }
      });

      if (betmateRecord) {
        await prisma.matchBetmate.update({
          where: { id: betmateRecord.id },
          data: {
            userScore: {
              increment: -points,
            },
            status: betmateStatus,
          },
        });
      }

      // Mark this user-betmate pair as processed for this match
      processedPairs.add(`${userId}-${betmateId}`);
      processedPairs.add(`${betmateId}-${userId}`);

      console.log(`Updated scores for betmate: ${betmate.id}`);
    }
  } catch (error) {
    console.error('Error updating user scores:', error.message);
  }
};

// Run the simulation
simulateMatchCompletion();
