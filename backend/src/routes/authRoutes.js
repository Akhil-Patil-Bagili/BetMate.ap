const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {validateToken}  = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/validate', validateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Authenticated successfully", userId: user.id, firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;

module.exports = router;
