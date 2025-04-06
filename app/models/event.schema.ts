export const runtime = 'nodejs';

import mongoose from 'mongoose';
import getModel from '../utils/modelFactory';

// Define the structure for custom questions
export interface ICustomQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'yesno' | 'multiple';
  options?: string[]; // For multiple choice questions
  required?: boolean;
}

// Define the Event document interface
export interface IEvent extends mongoose.Document {
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
  organizerId: mongoose.Types.ObjectId | string;
  customQuestions?: ICustomQuestion[];
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

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
      type: mongoose.Types.ObjectId,
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

// Get the appropriate model (real or mock)
export const Event = getModel('Event', EventSchema) as mongoose.Model<IEvent>;

export default Event; 