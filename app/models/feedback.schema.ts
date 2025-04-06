export const runtime = 'nodejs';

import type { Document, Model, Schema as SchemaType } from 'mongoose';
import { getMongoose } from '../utils/database';

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
export interface IFeedback extends Document {
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

let FeedbackModel: Model<IFeedback> | null = null;

// Function to get or create the Feedback model
export async function getFeedbackModel(): Promise<Model<IFeedback>> {
  if (FeedbackModel) return FeedbackModel;
  
  // Get mongoose instance
  const mongoose = await getMongoose();
  
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

  // Create the model
  FeedbackModel = mongoose.models && mongoose.models.Feedback
    ? (mongoose.models.Feedback as Model<IFeedback>)
    : mongoose.model<IFeedback>('Feedback', FeedbackSchema);
    
  return FeedbackModel;
}

// Export a proxy object for backward compatibility
const Feedback = new Proxy({} as Model<IFeedback>, {
  get: function(target, prop) {
    // Return a function that will resolve the model first
    if (typeof prop === 'string' || typeof prop === 'symbol') {
      return (...args: any[]) => {
        return getFeedbackModel().then(model => {
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

export { Feedback };
export default Feedback; 