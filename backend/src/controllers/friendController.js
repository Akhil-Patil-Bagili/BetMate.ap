const prisma = require('../prismaClient');
const { Prisma } = require('@prisma/client'); // Correctly import Prisma to access error types

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
    const { requesterId, addresseeId } = req.body;
    
    try {
      // Check if both users exist
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { id: requesterId },
            { id: addresseeId }
          ]
        }
      });
  
      // If the number of users found is not 2, one or both IDs are invalid
      if (users.length !== 2) {
        return res.status(404).json({ message: "One or both users not found" });
      }
  
      // Create friend request
      const friendRequest = await prisma.friendRequest.create({
        data: {
          requesterId,
          addresseeId,
          status: 'pending'
        }
      });
      res.status(201).json(friendRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to send friend request", error: error.message });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params; // Corrected line

    try {
        const friendRequest = await prisma.friendRequest.update({
            where: { id: parseInt(requestId) },
            data: { status: 'accepted' }
        });
        res.status(200).json(friendRequest);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            res.status(404).json({ message: "Friend request not found", error: error.message });
        } else {
            res.status(500).json({ message: "Failed to accept friend request", error: error.message });
        }
    }
};


// Decline a friend request
exports.declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
      const friendRequest = await prisma.friendRequest.update({
        where: { id: parseInt(requestId) },
        data: { status: 'declined' }
      });
      res.status(200).json(friendRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to decline friend request", error: error.message });
    }
};

// List all friends
exports.listFriends = async (req, res) => {
    const { userId } = req.params;
    try {
      const friends = await prisma.friendRequest.findMany({
        where: {
          OR: [
            { requesterId: parseInt(userId), status: 'accepted' },
            { addresseeId: parseInt(userId), status: 'accepted' }
          ]
        },
        include: {
          requester: true,
          addressee: true
        }
      });
      res.json(friends.map(f => f.requesterId === parseInt(userId) ? f.addressee : f.requester));
    } catch (error) {
      res.status(500).json({ message: "Failed to list friends", error: error.message });
    }
};
