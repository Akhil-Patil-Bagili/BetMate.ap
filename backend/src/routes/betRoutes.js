 // src/routes/betRoutes.js
 const express = require('express');
 const router = express.Router();
 const betController = require('../controllers/betController');
 const { validateToken } = require('../middleware/authMiddleware');
 
 router.get('/user/:userId',validateToken, betController.getUserBets);
 router.post('/initiateToss', validateToken, betController.initiateToss);
 router.post('/chooseTeam', validateToken, betController.chooseTeam); 
 
 module.exports = router;