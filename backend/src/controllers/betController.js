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

      const transaction = await prisma.$transaction([
        prisma.bet.create({
            data: {
                userId,
                opponentId, 
                matchId,
                choice,
                opponentChoice: opponentChoice, 
                result: 'Pending'
            }
        }),
        prisma.bet.create({
            data: {
                userId: opponentId,
                opponentId: userId, 
                matchId,
                choice: opponentChoice,
                opponentChoice: choice,
                result: 'Pending'
            }
        })
    ]);
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

 
  