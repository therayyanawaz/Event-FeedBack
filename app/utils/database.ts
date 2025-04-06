export const runtime = 'nodejs';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-feedback';

// Global variable to maintain connection state
let isConnected = false;
let isOfflineMode = false;

/**
 * Connect to MongoDB with fallback for when MongoDB is unavailable
 */
async function connectToDatabase() {
  // If already connected, return
  if (isConnected) {
    return;
  }

  // If in offline mode, don't try to connect again
  if (isOfflineMode) {
    console.log('Operating in offline mode, no database connection');
    return null;
  }

  try {
    // Log connection attempt
    console.log(`Connecting to MongoDB...`);

    // Set mongoose connection options
    mongoose.set('strictQuery', true);
    
    // Try to connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });

    isConnected = true;
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    isOfflineMode = true;
    return null;
  }
}

/**
 * Checks if the database is connected
 */
export function isDatabaseConnected() {
  return isConnected && !isOfflineMode;
}

export default connectToDatabase; 