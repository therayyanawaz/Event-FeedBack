import { isDatabaseConnected } from './database';
import { createMockModel } from './mockDb';
import mongoose from 'mongoose';

// Store references to the real models
const realModels: Record<string, any> = {};

/**
 * Get the appropriate model based on database availability
 * @param name Model name
 * @param schema Mongoose schema (only needed first time)
 * @returns Either real Mongoose model or mock model
 */
export function getModel(name: string, schema?: mongoose.Schema) {
  const isDbConnected = isDatabaseConnected();
  
  if (isDbConnected) {
    // Use real Mongoose model
    if (!realModels[name]) {
      if (!schema) {
        throw new Error(`Schema required for first initialization of model ${name}`);
      }
      // Create the model if it doesn't exist
      realModels[name] = mongoose.models[name] || mongoose.model(name, schema);
    }
    return realModels[name];
  } else {
    // Use mock model
    return createMockModel(name);
  }
}

export default getModel; 