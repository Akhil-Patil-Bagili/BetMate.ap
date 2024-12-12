const prisma = require('../prismaClient');
const { Prisma } = require('@prisma/client'); 

exports.sendFriendRequest = async (req, res) => {
    const { requesterId, addresseeId } = req.body;
    
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { id: requesterId },
            { id: addresseeId }
          ]
        }
      });
  
      if (users.length !== 2) {
        return res.status(404).json({ message: "One or both users not found" });
      }
  
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

exports.getPendingRequests = async (req, res) => {
  const userId = parseInt(req.user.userId);

  try {
      const pendingRequests = await prisma.friendRequest.findMany({
          where: {
              OR: [
                  { addresseeId: userId, status: 'pending' }, // Requests where the user is the receiver
              ],
          },
          include: {
              requester: {
                  select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                  },
              },
          },
      });

      const mappedRequests = pendingRequests.map((request) => ({
          id: request.id,
          name: `${request.requester.firstName} ${request.requester.lastName}`,
          requesterId: request.requester.id,
          addresseeId: userId,
          status: request.status,
      }));

      res.json(mappedRequests);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch pending requests', error: error.message });
  }
};


exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params; 

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

exports.removeFriend = async (req, res) => {
  const { userId } = req.user; 
  const { betMateId } = req.params;

  try {
      const connection = await prisma.friendRequest.findFirst({
          where: {
              OR: [
                  { requesterId: userId, addresseeId: parseInt(betMateId), status: 'accepted' },
                  { requesterId: parseInt(betMateId), addresseeId: userId, status: 'accepted' },
              ],
          },
      });

      if (!connection) {
          return res.status(404).json({ message: 'Betmate not found' });
      }

      await prisma.pastBetmate.create({
        data: {
            userId: connection.requesterId === userId ? connection.requesterId : connection.addresseeId,
            betmateId: connection.requesterId === userId ? connection.addresseeId : connection.requesterId,
        },
    });

      await prisma.friendRequest.delete({
          where: {
              id: connection.id,
          },
      });

      res.status(200).json({ message: 'Betmate removed successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to remove betmate', error: error.message });
  }
};

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

exports.getPastBetmates = async (req, res) => {
  const { userId } = req.user;

  try {
      const pastBetmates = await prisma.pastBetmate.findMany({
          where: { userId },
          include: {
              betmate: {
                  select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                  },
              },
          },
      });

      res.json(pastBetmates.map(p => p.betmate));
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch past betmates', error: error.message });
  }
};

