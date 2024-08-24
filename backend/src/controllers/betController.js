const prisma = require('../prismaClient');

exports.placeBet = async (req, res) => {
    const { userId, opponentId, matchId, choice } = req.body;

    try {
        const match = await prisma.match.findUnique({
            where: { id: matchId }
        });
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        const opponentChoice = choice === match.team1 ? match.team2 : match.team1;

        let userResult, opponentResult;
        let userPoints, opponentPoints;

        // Determine the results and points based on the current winner
        if (match.winner === choice) {
            userResult = 'Win';
            userPoints = 10;

            opponentResult = 'Lose';
            opponentPoints = -10;
        } else if (match.winner === opponentChoice) {
            userResult = 'Lose';
            userPoints = -10;

            opponentResult = 'Win';
            opponentPoints = 10;
        } else if (match.winner === 'unknown') {
            userResult = 'unknown';
            userPoints = 0;

            opponentResult = 'unknown';
            opponentPoints = 0;
        }

        const transaction = await prisma.$transaction([
            prisma.bet.create({
                data: {
                    userId,
                    opponentId,
                    matchId,
                    choice,
                    opponentChoice,
                    result: userResult,
                    points: userPoints
                }
            }),
            prisma.bet.create({
                data: {
                    userId: opponentId,
                    opponentId: userId,
                    matchId,
                    choice: opponentChoice,
                    opponentChoice: choice,
                    result: opponentResult,
                    points: opponentPoints
                }
            })
        ]);

        // Update the user's score
        const userScore = await prisma.bet.aggregate({
            _sum: {
                points: true
            },
            where: {
                userId: userId
            }
        });

        const opponentScore = await prisma.bet.aggregate({
            _sum: {
                points: true
            },
            where: {
                userId: opponentId
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { score: userScore._sum.points || 0 }
        });

        await prisma.user.update({
            where: { id: opponentId },
            data: { score: opponentScore._sum.points || 0 }
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error placing bet:', error);
        res.status(500).json({ message: "Failed to place bet", error: error.message });
    }
};


exports.getUserBets = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const bets = await prisma.bet.findMany({
            where: { userId },
            include: {
                match: true,
                opponent: true 
            }
        });
        res.json(bets);
    } catch (error) {
        console.error('Error retrieving bets:', error);
        res.status(500).json({ message: "Failed to retrieve bets", error: error.message });
    }
};
