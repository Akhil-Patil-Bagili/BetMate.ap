 // src/routes/betRoutes.js
 const express = require('express');
 const router = express.Router();
 const betController = require('../controllers/betController');
 const { validateToken } = require('../middleware/authMiddleware');
 
 router.post('/placeBet', validateToken, betController.placeBet);
 router.get('/user/:userId',validateToken, betController.getUserBets);
 
 module.exports = router;