const mongoose = require('mongoose');

const { DB_USERNAME, DB_PASSWORD } = process.env;
const password = encodeURIComponent(DB_PASSWORD);
const MONGO_URI = `mongodb+srv://${DB_USERNAME}:${password}@mern-abhishekh.rttixa2.mongodb.net/`;

// Cache the connection for serverless functions
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectToDatabase;
