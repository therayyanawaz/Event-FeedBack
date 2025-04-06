export const runtime = 'nodejs';

import type { Document, Model, Schema as SchemaType, Types } from 'mongoose';
import { getMongoose } from '../utils/database';

// Define the structure for custom questions
export interface ICustomQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'yesno' | 'multiple';
  options?: string[]; // For multiple choice questions
  required?: boolean;
}

// Define the Event document interface
export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  feedbackCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  timezone: string;
  organizerId: Types.ObjectId | string;
  customQuestions?: ICustomQuestion[];
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

let EventModel: Model<IEvent> | null = null;

// Function to get or create the Event model
export async function getEventModel(): Promise<Model<IEvent>> {
  if (EventModel) return EventModel;
  
  // Get mongoose instance
  const mongoose = await getMongoose();
  
  // Schema definition
  const EventSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      date: { type: Date, required: true },
      location: { type: String },
      organizer: { type: String },
      feedbackCount: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
      timezone: {
        type: String,
        default: 'UTC',
      },
      organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      customQuestions: [
        {
          id: {
            type: String,
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            enum: ['rating', 'text', 'yesno', 'multiple'],
            required: true,
          },
          options: [String], // For multiple choice questions
          required: {
            type: Boolean,
            default: true,
          },
        },
      ],
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      logoUrl: String,
      primaryColor: {
        type: String,
        default: '#0ea5e9', // Default primary color
      },
      secondaryColor: {
        type: String,
        default: '#8b5cf6', // Default secondary color
      },
    },
    { timestamps: true }
  );

  // Indexes for efficient querying
  EventSchema.index({ date: 1 });
  EventSchema.index({ isActive: 1 });

  // Create the model
  EventModel = mongoose.models && mongoose.models.Event
    ? (mongoose.models.Event as Model<IEvent>)
    : mongoose.model<IEvent>('Event', EventSchema);
    
  return EventModel;
}

// Export a proxy object for backward compatibility
const Event = new Proxy({} as Model<IEvent>, {
  get: function(target, prop) {
    // Return a function that will resolve the model first
    if (typeof prop === 'string' || typeof prop === 'symbol') {
      return (...args: any[]) => {
        return getEventModel().then(model => {
          const value = (model as any)[prop];
          if (typeof value === 'function') {
            return value.apply(model, args);
          }
          return value;
        });
      };
    }
    return undefined;
  }
});

export { Event };
export default Event; 