const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.message === 'User already exists' || err.message === 'Please enter all fields') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    if (err.message === 'Invalid Credentials' || err.message === 'Please enter all fields') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  signup,
  login,
};
