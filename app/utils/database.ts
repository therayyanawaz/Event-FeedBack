export const runtime = 'nodejs';

// Use a type-only import for TypeScript types
import type { Connection, Mongoose } from 'mongoose';

let mongoose: Mongoose | null = null;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-feedback';

// Global variable to maintain connection state
let isConnected = false;
let isOfflineMode = false;
let mongooseConnection: Connection | null = null;

/**
 * Connect to MongoDB with fallback for when MongoDB is unavailable
 */
async function connectToDatabase() {
  // If already connected, return
  if (isConnected) {
    return mongooseConnection;
  }

  // If in offline mode, don't try to connect again
  if (isOfflineMode) {
    console.log('Operating in offline mode, no database connection');
    return null;
  }

  try {
    // Log connection attempt
    console.log(`Connecting to MongoDB...`);

    // Dynamically import mongoose only when needed (helps with Edge Runtime)
    if (!mongoose) {
      const module = await import('mongoose');
      mongoose = module.default;
    }
    
    // Set mongoose connection options
    mongoose.set('strictQuery', true);
    
    // Try to connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });

    isConnected = true;
    mongooseConnection = mongoose.connection;
    console.log('Connected to MongoDB');
    return mongooseConnection;
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

/**
 * Get the mongoose instance (for use in other files)
 */
export async function getMongoose() {
  if (!mongoose) {
    const module = await import('mongoose');
    mongoose = module.default;
  }
  return mongoose;
}

export default connectToDatabase; 