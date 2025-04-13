const { Conversation } = require('../models/chatModel');
const {lawyer} = require('../models/lawyerModels');
const Case = require('../models/caseModel');
const mongoose = require('mongoose');

// Get all conversations for a user (prisoner or lawyer)
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type } = req.query; // 'prisoner' or 'lawyer'

    let query = {};
    if (type === 'prisoner') {
      query = { prisoner: userId };
    } else if (type === 'lawyer') {
      query = { lawyer: userId };
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be prisoner or lawyer.' 
      });
    }

    const conversations = await Conversation.find(query)
      .populate({
        path: 'prisoner',
        select: 'name profileImage'
      })
      .populate({
        path: 'lawyer',
        select: 'name profileImage specialization experience'
      })
      .populate({
        path: 'case',
        select: 'cnr_number cnr_details'
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversations', 
      error: error.message 
    });
  }
};

// Get conversation with specific lawyer or prisoner
const getConversation = async (req, res) => {
  try {
    const { userId } = req.user;
    const { participantId } = req.params;
    const { userType } = req.query; // 'prisoner' or 'lawyer'

    let query = {};
    if (userType === 'prisoner') {
      query = { prisoner: userId, lawyer: participantId };
    } else if (userType === 'lawyer') {
      query = { lawyer: userId, prisoner: participantId };
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be prisoner or lawyer.' 
      });
    }

    let conversation = await Conversation.findOne(query)
      .populate({
        path: 'prisoner',
        select: 'name profileImage'
      })
      .populate({
        path: 'lawyer',
        select: 'name profileImage specialization experience'
      })
      .populate({
        path: 'case',
        select: 'cnr_number cnr_details'
      });

    // If conversation doesn't exist, create a new one
    if (!conversation && userType === 'prisoner') {
      const isValidLawyer = await lawyer.findById(participantId);
      if (!isValidLawyer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Lawyer not found' 
        });
      }

      conversation = new Conversation({
        prisoner: userId,
        lawyer: participantId,
        caseRequest: {
          status: 'pending',
          message: 'New case request'
        }
      });

      await conversation.save();

      // Populate the newly created conversation
      conversation = await Conversation.findById(conversation._id)
        .populate({
          path: 'prisoner',
          select: 'name profileImage'
        })
        .populate({
          path: 'lawyer',
          select: 'name profileImage specialization experience'
        });
    }

    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    // Mark all messages as read for the current user
    const otherUserType = userType === 'prisoner' ? 'Lawyer' : 'Prisioner';
    conversation.messages.forEach(message => {
      if (message.senderModel === otherUserType && !message.read) {
        message.read = true;
      }
    });
    await conversation.save();

    res.status(200).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch conversation', 
      error: error.message 
    });
  }
};

// Send a message in a conversation
const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { conversationId } = req.params;
    const { content, userType } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content cannot be empty' 
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    // Verify that the user is part of the conversation
    if (
      (userType === 'prisoner' && conversation.prisoner.toString() !== userId) ||
      (userType === 'lawyer' && conversation.lawyer.toString() !== userId)
    ) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to send messages in this conversation' 
      });
    }

    // Create and add the new message
    const newMessage = {
      sender: userId,
      senderModel: userType === 'prisoner' ? 'Prisioner' : 'Lawyer',
      content,
      timestamp: Date.now(),
      read: false
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = Date.now();
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message 
    });
  }
};

// Prisoner requests a lawyer to take their case
const requestLawyer = async (req, res) => {
  try {
    const { userId } = req.user;
    const { lawyerId, caseId, message } = req.body;

    // Validate lawyer exists
    const lawyerData = await lawyer.findById(lawyerId);
    if (!lawyerData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lawyer not found' 
      });
    }

    // Validate case exists if provided
    if (caseId) {
      const caseExists = await Case.findById(caseId);
      if (!caseExists) {
        return res.status(404).json({ 
          success: false, 
          message: 'Case not found' 
        });
      }
    }

    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      prisoner: userId,
      lawyer: lawyerId
    });

    if (!conversation) {
      // Create new conversation with case request
      conversation = new Conversation({
        prisoner: userId,
        lawyer: lawyerId,
        case: caseId || null,
        caseRequest: {
          status: 'pending',
          message: message || 'Please take my case'
        }
      });

      // Add initial message
      conversation.messages.push({
        sender: userId,
        senderModel: 'Prisioner',
        content: message || 'I would like to request your legal services.',
        timestamp: Date.now()
      });

      await conversation.save();
    } else {
      // Update existing conversation
      conversation.caseRequest = {
        status: 'pending',
        message: message || 'Please take my case'
      };
      conversation.case = caseId || conversation.case;

      // Add request message if it's a new request
      if (conversation.caseRequest.status !== 'pending') {
        conversation.messages.push({
          sender: userId,
          senderModel: 'Prisioner',
          content: message || 'I would like to request your legal services.',
          timestamp: Date.now()
        });
      }

      await conversation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Lawyer request sent successfully',
      conversation
    });
  } catch (error) {
    console.error('Error requesting lawyer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send lawyer request', 
      error: error.message 
    });
  }
};

// Lawyer responds to a case request
const respondToCaseRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const { conversationId } = req.params;
    const { status, message } = req.body;

    if (status !== 'accepted' && status !== 'rejected') {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be either accepted or rejected' 
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Conversation not found' 
      });
    }

    // Verify that the user is the lawyer in this conversation
    if (conversation.lawyer.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to respond to this request' 
      });
    }

    // Update request status
    conversation.caseRequest.status = status;
    if (message) {
      conversation.caseRequest.message = message;
    }

    // Add response message
    const responseMessage = status === 'accepted' 
      ? message || 'I have accepted your case request.'
      : message || 'I cannot take your case at this time.';

    conversation.messages.push({
      sender: userId,
      senderModel: 'Lawyer',
      content: responseMessage,
      timestamp: Date.now()
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      message: `Case request ${status} successfully`,
      conversation
    });
  } catch (error) {
    console.error('Error responding to case request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to respond to case request', 
      error: error.message 
    });
  }
};

// Get all available lawyers for a prisoner to contact
const getAvailableLawyers = async (req, res) => {
  try {
    const { specialization, experience, language } = req.query;
    
    let query = {};
    
    // Apply filters if provided
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }
    
    if (language) {
      query.languages = language;
    }

    const lawyers = await lawyer.find(query)
      .select('name profileImage specialization experience languages rating')
      .sort({ rating: -1, experience: -1 });

    res.status(200).json({
      success: true,
      count: lawyers.length,
      lawyers
    });
  } catch (error) {
    console.error('Error fetching available lawyers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch available lawyers', 
      error: error.message 
    });
  }
};

/**
 * Format a date to readable string format
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get all accepted clients for a lawyer
const getAcceptedClients = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find all conversations where this lawyer has accepted case requests
    const conversations = await Conversation.find({
      lawyer: userId,
      'caseRequest.status': 'accepted'
    })
    .populate({
      path: 'prisoner',
      select: 'name profileImage phone email address'
    })
    .populate({
      path: 'case',
      select: 'cnr_number cnr_details court_name filing_date status next_hearing_date'
    })
    .sort({ updatedAt: -1 });

    // Extract client information
    const clients = conversations.map(conversation => {
      const lastMessage = conversation.messages.length > 0 
        ? conversation.messages[conversation.messages.length - 1] 
        : null;

      // Format dates before sending to frontend
      return {
        conversationId: conversation._id,
        prisoner: conversation.prisoner,
        caseRequested: conversation.caseRequest.caseType,
        requestDate: formatDate(conversation.caseRequest.requestDate),
        requestDateRaw: conversation.caseRequest.requestDate,
        acceptedDate: formatDate(conversation.caseRequest.respondDate),
        acceptedDateRaw: conversation.caseRequest.respondDate,
        lastMessage: lastMessage ? lastMessage.content : null,
        lastMessageDate: lastMessage ? formatDate(lastMessage.timestamp) : null,
        lastMessageDateRaw: lastMessage ? lastMessage.timestamp : null,
        case: conversation.case ? {
          ...conversation.case._doc,
          filing_date: formatDate(conversation.case.filing_date),
          next_hearing_date: formatDate(conversation.case.next_hearing_date),
          filing_date_raw: conversation.case.filing_date,
          next_hearing_date_raw: conversation.case.next_hearing_date,
        } : null
      };
    });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients
    });
  } catch (error) {
    console.error('Error fetching accepted clients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch accepted clients', 
      error: error.message 
    });
  }
};

module.exports = {
  getUserConversations,
  getConversation,
  sendMessage,
  requestLawyer,
  respondToCaseRequest,
  getAvailableLawyers,
  getAcceptedClients
};
