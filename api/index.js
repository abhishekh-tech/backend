const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Manual CORS for serverless
app.use((req, res, next) => {
  const allowedOrigins = ['https://frontend-f63r.vercel.app', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

const { DB_USERNAME, DB_PASSWORD } = process.env;
const password = encodeURIComponent(DB_PASSWORD);
const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${password}@mern-abhishekh.rttixa2.mongodb.net/`;

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("DB Connected Successfully");
  } catch (err) {
    console.log("DB Connection Error", err);
    throw err;
  }
};

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/courses', require('../routes/courses'));
app.use('/api/users', require('../routes/users'));
app.use('/api/enrollments', require('../routes/enrollments'));
app.use('/api/messages', require('../routes/messages'));
app.use('/api/skills', require('../routes/skills'));
app.use('/api/certificates', require('../routes/certificates'));

// Basic initial route
app.get('/', (req, res) => {
  res.send('Skill Exchange API is running!');
});

// Export for Vercel serverless
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
