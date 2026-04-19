const messageService = require('../services/messageService');
const User = require('../models/User');

const createMessage = async (req, res) => {
  try {
    const { recipientEmail, body, course } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ message: 'recipientEmail is required' });
    }
    if (!body) {
      return res.status(400).json({ message: 'body is required' });
    }

    // Lookup recipient by email
    const recipientUser = await User.findOne({ email: recipientEmail.toLowerCase().trim() });
    if (!recipientUser) {
      return res.status(404).json({ message: `User with email "${recipientEmail}" not found` });
    }

    // Prevent sending to self
    const senderId = req.user.userId || req.user._id;
    if (recipientUser._id.toString() === senderId.toString()) {
      return res.status(400).json({ message: "You cannot send a message to yourself" });
    }

    const messageData = {
      sender: senderId,
      recipient: recipientUser._id,
      body,
      course
    };

    const message = await messageService.createMessage(messageData);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    // Users only see their own messages (as sender or recipient)
    const messages = await messageService.getMessages(req.user._id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const messages = await messageService.getConversation(req.user._id, req.params.userId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    res.json(message);
  } catch (err) {
    if (err.message === 'Message not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const result = await messageService.deleteMessage(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Message not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getConversation,
  getMessageById,
  deleteMessage,
};
