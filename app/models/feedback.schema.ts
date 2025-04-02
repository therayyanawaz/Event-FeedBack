import mongoose from 'mongoose';
import getModel from '../utils/modelFactory';

// Define the structure for feedback responses
export interface IFeedbackResponse {
  overall?: string;
  content?: string;
  speakers?: string;
  venue?: string;
  highlights?: string;
  improvements?: string;
  future?: string;
  highlights_sentiment?: string;
  improvements_sentiment?: string;
  [key: string]: string | undefined; // Allow for dynamic keys
}

// Define the structure for the conversation message
export interface IConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Interface for feedback document
export interface IFeedback extends mongoose.Document {
  eventId: string;
  conversationId: string;
  userId?: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: Date;
  }>;
  responses: Record<string, string>;
  completed: boolean;
  completedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  sentimentScores?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const FeedbackSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    conversationId: { type: String, required: true, unique: true },
    userId: { type: String },
    messages: [
      {
        role: { type: String, required: true, enum: ['system', 'user', 'assistant'] },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    responses: { type: Object, default: {} },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    userAgent: { type: String },
    ipAddress: { type: String },
    sentimentScores: { type: Object }
  },
  { timestamps: true }
);

// Indexes for efficient querying
FeedbackSchema.index({ eventId: 1 });
FeedbackSchema.index({ conversationId: 1 }, { unique: true });
FeedbackSchema.index({ userId: 1 });
FeedbackSchema.index({ completed: 1 });
FeedbackSchema.index({ createdAt: 1 });

// Get the appropriate model (real or mock)
export const Feedback = getModel('Feedback', FeedbackSchema) as mongoose.Model<IFeedback>;

export default Feedback; 