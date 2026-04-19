const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  const { name, email, password, role } = userData;
  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }
  user = new User({ name, email, password, role });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};

const getUsers = async () => {
  return await User.find().select('-password');
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const updateUser = async (id, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
