const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {validateToken}  = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/validate', validateToken, (req, res) => {
    res.status(200).json({ message: "Authenticated successfully", userId: req.user.userId });
});

module.exports = router;
