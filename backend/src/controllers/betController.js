const prisma = require('../prismaClient');

// Function to retrieve the bets for a specific user
exports.getUserBets = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const bets = await prisma.matchBetmate.findMany({
            where: { userId },
            include: {
                match: true,
                betmate: true 
            }
        });
        res.json(bets);
    } catch (error) {
        console.error('Error retrieving bets:', error);
        res.status(500).json({ message: "Failed to retrieve bets", error: error.message });
    }
};

// Function to initiate a coin toss between a user and a betmate
exports.initiateToss = async (req, res) => {
    const { userId, betmateId, matchId } = req.body;

    try {
        // Check if a toss has already been initiated for this match between these users
        const existingBetmate = await prisma.matchBetmate.findFirst({
            where: {
                matchId,
                userId,
                betmateId,
                isTossed: true,
            }
        });

        if (existingBetmate) {
            return res.status(400).json({ message: "Toss has already been initiated for this betmate." });
        }

        // Simulate the coin toss
        const tossWinnerId = Math.random() > 0.5 ? userId : betmateId;

        // Create a record for this match-betmate with the toss result for the user
        const matchBetmate = await prisma.matchBetmate.create({
            data: {
                userId,
                matchId,
                betmateId,
                isTossed: true,
                tossWinnerId,
                status: tossWinnerId === userId ? "toss_won" : "toss_lose"
            }
        });

        // Create a record for the opponent's side of the match-betmate
        await prisma.matchBetmate.create({
            data: {
                userId: betmateId,
                matchId,
                betmateId: userId,
                isTossed: true,
                tossWinnerId,
                status: tossWinnerId === betmateId ? "toss_won" : "toss_lose"
            }
        });

        res.status(201).json({ matchBetmate, message: tossWinnerId === userId ? "You won the toss!" : "You lost the toss. Waiting for your opponent to choose a team." });
    } catch (error) {
        console.error('Error initiating toss:', error);
        res.status(500).json({ message: "Failed to initiate toss", error: error.message });
    }
};

// Function to choose a team after winning the toss
exports.chooseTeam = async (req, res) => {
    const { userId, matchId, teamChoice } = req.body;

    try {
        // Find the MatchBetmate where the user won the toss
        const matchBetmate = await prisma.matchBetmate.findFirst({
            where: {
                matchId,
                userId,
                isTossed: true,
                status: "toss_won" // Only proceed if the user has won the toss
            },
            include: {
                match: true // Include match details to determine opponent's team
            }
        });

        if (!matchBetmate) {
            return res.status(404).json({ message: "No valid toss found for this user and match." });
        }

        // Determine the opponent's choice
        const opponentChoice = teamChoice === matchBetmate.match.team1 ? matchBetmate.match.team2 : matchBetmate.match.team1;

        // Update the match-betmate record with the chosen teams for the user
        const updatedMatchBetmate = await prisma.matchBetmate.update({
            where: {
                id: matchBetmate.id
            },
            data: {
                userChoice: teamChoice,
                betmateChoice: opponentChoice,
                status: "team_chosen"
            }
        });

        // Update the match-betmate record for the betmate
        await prisma.matchBetmate.update({
            where: {
                userId_matchId_betmateId: {
                    userId: matchBetmate.betmateId,
                    matchId: matchBetmate.matchId,
                    betmateId: matchBetmate.userId
                }
            },
            data: {
                userChoice: opponentChoice,
                betmateChoice: teamChoice,
                status: "team_chosen"
            }
        });

        res.status(200).json({ message: "Team choice submitted successfully.", updatedMatchBetmate });
    } catch (error) {
        console.error('Error choosing team:', error);
        res.status(500).json({ message: "Failed to submit team choice", error: error.message });
    }
};

exports.getUserTotalScore = async (req, res) => {
    const { userId } = req.params;
    const { betmateId } = req.query;

    try {
        const totalScore = await prisma.matchBetmate.aggregate({
            _sum: {
                userScore: true
            },
            where: {
                userId: parseInt(userId),
                betmateId: parseInt(betmateId)
            }
        });

        res.json({ totalScore: totalScore._sum.userScore || 0 });
    } catch (error) {
        console.error('Error fetching total score:', error.message);
        res.status(500).json({ message: "Error fetching total score", error: error.message });
    }
};
