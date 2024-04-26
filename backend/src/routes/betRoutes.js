 // src/routes/betRoutes.js
 const express = require('express');
 const router = express.Router();
 const betController = require('../controllers/betController');
 
 router.post('/placeBet', betController.placeBet);
 router.get('/user/:userId', betController.getUserBets);
 
 module.exports = router;