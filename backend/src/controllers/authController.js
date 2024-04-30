const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                firstName,
                lastName,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "User registration failed", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
        res.status(200).json({ message: "Logged in successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully!" });
};
