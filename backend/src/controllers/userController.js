const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.userSearch = async (req, res) => {
    const { query } = req.query;
    const currentUserId = req.user.userId;
    const existingFriends = await prisma.friendRequest.findMany({
        where: {
          OR: [
            { requesterId: currentUserId, status: 'accepted' },
            { addresseeId: currentUserId, status: 'accepted' }
          ]
        },
        select: {
          requesterId: true,
          addresseeId: true
        }
      });
      const friendIds = existingFriends.flatMap(fr => [fr.requesterId, fr.addresseeId]);
    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [...friendIds, currentUserId],
                  },
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { firstName: { contains: query, mode: 'insensitive' } },
                    { lastName: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
};



exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    const { betmateId } = req.query; 

    try {
        const betmateScore = await prisma.matchBetmate.findFirst({
            where: {
                userId: parseInt(userId),
                betmateId: parseInt(betmateId),
            },
            select: {
                userScore: true,
            }
        });

        if (!betmateScore) {
            return res.status(404).json({ message: "Score not found for this betmate" });
        }

        res.json({ score: betmateScore.userScore });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
};



