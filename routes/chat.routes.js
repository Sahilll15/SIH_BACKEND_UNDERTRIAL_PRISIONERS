const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controllers');
const { validateToken } = require('../middlewares/validateToken')

// Get all conversations for a user
router.get('/conversations', validateToken, chatController.getUserConversations);

// Get conversation with specific participant
router.get('/conversation/:participantId', validateToken, chatController.getConversation);

// Send a message in a conversation
router.post('/conversation/:conversationId/message', validateToken, chatController.sendMessage);

// Prisoner requests a lawyer to take their case
router.post('/request-lawyer', validateToken, chatController.requestLawyer);

// Lawyer responds to a case request
router.put('/conversation/:conversationId/respond', validateToken, chatController.respondToCaseRequest);

// Get all available lawyers
router.get('/lawyers', validateToken, chatController.getAvailableLawyers);

// Get all accepted clients for a lawyer
router.get('/accepted-clients', validateToken, chatController.getAcceptedClients);

module.exports = router;
