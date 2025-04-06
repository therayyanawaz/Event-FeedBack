export const runtime = 'nodejs';

/**
 * This file provides mock database functionality when MongoDB is not available
 */

// In-memory storage
const collections = new Map<string, Map<string, any>>();

/**
 * Mock document implementation
 */
class MockDocument {
  [key: string]: any;
  _id: string;

  constructor(data: any) {
    Object.assign(this, data);
    // Generate ID if not provided
    if (!this._id) {
      this._id = Math.random().toString(36).substring(2, 15);
    }
  }

  // Mock save method
  async save() {
    const collection = this.constructor.name.toLowerCase();
    if (!collections.has(collection)) {
      collections.set(collection, new Map());
    }
    collections.get(collection)?.set(this._id, this);
    return this;
  }
}

/**
 * Mock model implementation
 */
export class MockModel {
  static modelName: string;
  static schema: any;

  constructor(data: any) {
    return new MockDocument(data);
  }

  // Find by ID
  static async findById(id: string) {
    const collection = collections.get(this.modelName.toLowerCase());
    if (!collection) return null;
    return collection.get(id) || null;
  }

  // Find one document matching the criteria
  static async findOne(criteria: any) {
    const collection = collections.get(this.modelName.toLowerCase());
    if (!collection) return null;
    
    // Simple criteria matching
    const entries = Array.from(collection.values());
    return entries.find(doc => {
      return Object.entries(criteria).every(([key, value]) => doc[key] === value);
    }) || null;
  }

  // Find and update
  static async findByIdAndUpdate(id: string, update: any) {
    const collection = collections.get(this.modelName.toLowerCase());
    if (!collection) return null;
    
    const doc = collection.get(id);
    if (!doc) return null;
    
    // Handle $inc operator
    if (update.$inc) {
      Object.entries(update.$inc).forEach(([key, value]) => {
        if (typeof value === 'number') {
          doc[key] = (doc[key] || 0) + value;
        }
      });
    } else {
      // Regular update
      Object.assign(doc, update);
    }
    
    collection.set(id, doc);
    return doc;
  }
}

/**
 * Create a mock model class with the given name
 */
export function createMockModel(name: string): typeof MockModel {
  class CustomMockModel extends MockModel {
    static modelName = name;
  }
  return CustomMockModel;
}

/**
 * Clear all mock data
 */
export function clearMockData() {
  collections.clear();
}

export default {
  createMockModel,
  clearMockData
}; 