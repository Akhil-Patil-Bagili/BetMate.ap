// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { validateToken } = require('../middleware/authMiddleware');

router.get('/', validateToken, matchController.matches);


module.exports = router;
