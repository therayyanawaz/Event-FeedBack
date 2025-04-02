import mongoose from 'mongoose';

// Add type definition for the global mongoose cache
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection | null> | null;
    isOfflineMode: boolean;
  };
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-feedback';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isOfflineMode: false };
}

/**
 * Connect to MongoDB with fallback for when MongoDB is unavailable
 */
async function connectToDatabase() {
  // If we're in offline mode, don't try to connect again
  if (cached.isOfflineMode) {
    console.log('Operating in offline mode, no database connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        cached.isOfflineMode = true; // Set offline mode flag
        return null; // Return null instead of throwing
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error establishing MongoDB connection:', error);
    cached.isOfflineMode = true;
    return null;
  }
}

/**
 * Checks if the database is connected
 */
export function isDatabaseConnected() {
  return !cached.isOfflineMode && 
         cached.conn !== null && 
         mongoose.connection.readyState === 1; // 1 = connected
}

export default connectToDatabase; 