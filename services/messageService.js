const Message = require('../models/Message');

const createMessage = async (messageData) => {
  const message = new Message(messageData);
  return await message.save();
};

const getMessages = async (userId = null) => {
  const filter = userId
    ? { $or: [{ sender: userId }, { recipient: userId }] }
    : {};
  return await Message.find(filter)
    .sort({ createdAt: -1 })
    .populate('sender', 'name email')
    .populate('recipient', 'name email');
};

const getConversation = async (userA, userB) => {
  return await Message.find({
    $or: [
      { sender: userA, recipient: userB },
      { sender: userB, recipient: userA },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email')
    .populate('recipient', 'name email');
};

const getMessageById = async (id) => {
  const message = await Message.findById(id).populate('sender', 'name email').populate('recipient', 'name email');
  if (!message) throw new Error('Message not found');
  return message;
};

const deleteMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  if (!message) throw new Error('Message not found');
  return { message: 'Message deleted successfully' };
};

module.exports = {
  createMessage,
  getMessages,
  getConversation,
  getMessageById,
  deleteMessage,
};
