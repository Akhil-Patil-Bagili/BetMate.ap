const prisma = require('./prismaClient');

// Function to simulate the completion of one match and updating the status of only one match
async function simulateMatchCompletion() {
  // Assume we are updating only the first match

  const updatedMatches = [
    {
      id: 89654, // Unique matchId
      date: new Date('2024-08-25T14:00:00.000Z'),
      team1: 'CSK',
      team2: 'MI',
      matchDescription: 'Test Match 1',
      location: 'Chennai',
      matchType: 'T20',
      seriesName: 'Indian Premier League 2024',
      state: 'complete', // Simulating the match completion
      status: 'Chennai Super Kings won by 6 wkts',
      winner: 'CSK',
    },
    {
      id: 89661, // The second match remains the same, no change
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
  
      const processedUsers = new Set();
  
      for (const betmate of matchBetmates) {
        const userId = betmate.userId;
        const betmateId = betmate.betmateId;
  
        // Ensure the user-betmate pair is processed only once
        if (processedUsers.has(`${userId}-${betmateId}`) || processedUsers.has(`${betmateId}-${userId}`)) {
          console.log(`Scores already updated for user-betmate pair: ${userId}-${betmateId}, skipping...`);
          continue;
        }
  
        console.log(`Processing betmate: ${betmate.id} - userChoice: ${betmate.userChoice}, betmateChoice: ${betmate.betmateChoice}`);
  
        let points = 0;
        if (betmate.userChoice === winner) {
          points = 10;
          console.log(`User ${betmate.userId} wins, awarding ${points} points.`);
        } else if (betmate.betmateChoice === winner) {
          points = -10;
          console.log(`User ${betmate.userId} loses, subtracting ${-points} points.`);
        }
  
        // Update the user's score
        await prisma.user.update({
          where: { id: betmate.userId },
          data: {
            score: {
              increment: points,
            },
          },
        });
  
        // Optionally update the betmate's score as well
        await prisma.user.update({
          where: { id: betmate.betmateId },
          data: {
            score: {
              increment: -points,
            },
          },
        });
  
        // Update the MatchBetmate record with points and status
        await prisma.matchBetmate.update({
          where: { id: betmate.id },
          data: {
            status: points > 0 ? "won" : "lost",
          },
        });
  
        // Mark this user-betmate pair as processed
        processedUsers.add(`${userId}-${betmateId}`);
        processedUsers.add(`${betmateId}-${userId}`);
  
        console.log(`Updated scores for betmate: ${betmate.id}`);
      }
    } catch (error) {
      console.error('Error updating user scores:', error.message);
    }
  };

// Run the simulation
simulateMatchCompletion();
