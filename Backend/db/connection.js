const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Connection error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
