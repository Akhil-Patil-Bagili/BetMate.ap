// src/controllers/betController.js
const prisma = require('../prismaClient');

exports.placeBet = async (req, res) => {
    const { userId, matchId, choice, points } = req.body;
    
    try {
      const bet = await prisma.bet.create({
        data: {
          userId,
          matchId,
          choice,
          points,
          result: 'Pending' // Default result when a bet is placed
        }
      });
      res.status(201).json(bet);
    } catch (error) {
      console.error('Error placing bet:', error);
      res.status(500).json({ message: "Failed to place bet", error: error.message });
    }
  };

exports.getUserBets = async (req, res) => {
    // Assuming you pass userId as a param
    const userId = parseInt(req.params.userId, 10);  // Convert userId from string to integer

    try {
      const bets = await prisma.bet.findMany({
        where: { userId: userId }, // Now correctly passing an integer for userId
        include: { match: true } // Include match details
      });
      res.json(bets);
    } catch (error) {
      console.error('Error retrieving bets:', error);
      res.status(500).json({ message: "Failed to retrieve bets", error: error.message });
    }
};
 
  