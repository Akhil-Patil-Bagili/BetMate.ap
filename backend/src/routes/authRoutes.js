const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ensure these route handlers are defined in authController
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
