const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const signup = async (userData) => {
  const { name, email, password, role } = userData;
  
  if (!name || !email || !password || !role) {
    throw new Error('Please enter all fields');
  }

  if (role !== 'student' && role !== 'teacher') {
    throw new Error('Invalid role specified');
  }

  let user = await User.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }

  user = new User({
    name,
    email,
    password,
    role: role || 'student', // default role
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please enter all fields');
  }

  let user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid Credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

module.exports = {
  signup,
  login,
};
