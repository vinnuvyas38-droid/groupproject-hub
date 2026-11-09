// config/db.js
// This file connects our server to the MongoDB database using Mongoose.

const mongoose = require('mongoose');

// connectDB is called once when the server starts
async function connectDB() {
  // Read the connection string from the .env file
  const uri = process.env.MONGO_URI;

  // If the developer forgot to set MONGO_URI, stop immediately with a clear message
  if (!uri) {
    console.error('❌  MONGO_URI is missing from your .env file.');
    console.error('    Open server/.env and set MONGO_URI to your MongoDB connection string.');
    process.exit(1); // Exit the Node process so we don't run with no database
  }

  try {
    // mongoose.connect returns a promise; we await it
    await mongoose.connect(uri);
    console.log('✅  MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    // If the connection fails (wrong credentials, Atlas not reachable, etc.) print it and exit
    console.error('❌  MongoDB connection failed:', err.message);
    console.error('    Check your MONGO_URI and make sure MongoDB is running.');
    process.exit(1);
  }
}

module.exports = connectDB;

