const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

router.post('/sendRequest', friendController.sendFriendRequest);
router.put('/acceptRequest/:requestId', friendController.acceptFriendRequest);
router.put('/declineRequest/:requestId', friendController.declineFriendRequest);
router.get('/list/:userId', friendController.listFriends);

module.exports = router;
