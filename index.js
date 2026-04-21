const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://frontend-f63r-jrs5mox87-abhishekh-redmen-team.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Allows parsing of JSON request bodies

const { DB_USERNAME, DB_PASSWORD } = process.env;
const password = encodeURIComponent(DB_PASSWORD);
// String literal
const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${password}@mern-abhishekh.rttixa2.mongodb.net/`;

(async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("DB Connected Successfully")
  } catch (err) {
    console.log("DB Connection Error", err)
  }
})();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/certificates', require('./routes/certificates'));

// Basic initial route
app.get('/', (req, res) => {
  res.send('Skill Exchange API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
