const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../middleware/authMiddleware');

router.get('/search', validateToken, userController.userSearch);
router.get('/:userId', validateToken, userController.getUserById); // New route

module.exports = router;