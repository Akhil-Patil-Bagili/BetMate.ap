 // src/routes/userRoutes.js
 const express = require('express');
 const router = express.Router();
 const userController = require('../controllers/userController');
 const { validateToken } = require('../middleware/authMiddleware');
 
 router.get('/search', validateToken, userController.userSearch);
 
 module.exports = router;