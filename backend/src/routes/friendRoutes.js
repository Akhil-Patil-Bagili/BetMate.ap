const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { validateToken } = require('../middleware/authMiddleware');


router.post('/sendRequest', validateToken, friendController.sendFriendRequest);
router.get('/pendingRequests', validateToken, friendController.getPendingRequests)
router.put('/acceptRequest/:requestId', validateToken, friendController.acceptFriendRequest);
router.put('/declineRequest/:requestId', validateToken, friendController.declineFriendRequest);
router.get('/list/:userId', validateToken,friendController.listFriends);
router.delete('/removeBetmate/:betMateId', validateToken, friendController.removeFriend);
router.get('/pastBetmates', validateToken, friendController.getPastBetmates);



module.exports = router;
