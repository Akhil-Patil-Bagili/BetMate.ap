const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.userSearch = async (req, res) => {
    const { query } = req.query;
    try {
        const users = await prisma.user.findMany({
            where: {
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
                lastName: true,
                score: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
};



exports.getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch user basic information
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                score: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate the user's score dynamically
        const userScore = await prisma.bet.aggregate({
            _sum: {
                points: true
            },
            where: {
                userId: parseInt(userId)
            }
        });

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { score: userScore._sum.points || 0 },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                score: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
};
