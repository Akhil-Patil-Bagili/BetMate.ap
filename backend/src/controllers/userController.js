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
                lastName: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
};
