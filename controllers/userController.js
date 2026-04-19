const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'User already exists') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    // Check if requester is admin or updating self
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
