const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  const conn = await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;
