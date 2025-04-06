export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  rateLimitedGenerateChatResponse as generateChatResponse, 
  rateLimitedAnalyzeSentiment as analyzeSentiment,
  ChatMessage 
} from '../../utils/groqApi';
import connectToDatabase, { isDatabaseConnected } from '../../utils/database';
import Feedback, { IFeedback } from '../../models/feedback.schema';
import Event from '../../models/event.schema';
import { headers } from 'next/headers';

// In-memory storage for when MongoDB is unavailable
const inMemoryFeedback = new Map<string, any>();
const inMemoryEvents = new Map<string, any>();

// Predefined questions for the feedback flow
const QUESTIONS = [
  {
    id: 'overall',
    text: 'On a scale of 1-5, how would you rate your overall experience at the event?',
    type: 'rating',
  },
  {
    id: 'content',
    text: 'How satisfied were you with the content and topics covered? (1-5)',
    type: 'rating',
  },
  {
    id: 'speakers',
    text: 'How would you rate the speakers and presenters? (1-5)',
    type: 'rating',
  },
  {
    id: 'venue',
    text: 'How satisfied were you with the venue and facilities? (1-5)',
    type: 'rating',
  },
  {
    id: 'highlights',
    text: "What were the highlights of the event for you?",
    type: 'text',
  },
  {
    id: 'improvements',
    text: "What aspects of the event could be improved?",
    type: 'text',
  },
  {
    id: 'future',
    text: "Would you be interested in attending similar events in the future?",
    type: 'yesno',
  },
];

// Cache for active conversations to reduce database load
const activeConversations = new Map<string, {
  lastAccessed: number;
  data: any;
}>();

// Clean up old conversations every hour
setInterval(() => {
  const now = Date.now();
  // Fix for TypeScript error with Map iteration
  Array.from(activeConversations.entries()).forEach(([key, value]) => {
    // Remove conversations inactive for more than 1 hour
    if (now - value.lastAccessed > 60 * 60 * 1000) {
      activeConversations.delete(key);
    }
  });
}, 60 * 60 * 1000);

// Add the type for the message objects in the conversation history
type ConversationMessage = {
  role: string;
  content: string;
  timestamp: Date;
};

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    const dbConnection = await connectToDatabase();
    const isDbConnected = isDatabaseConnected();
    
    // Get request data
    const { message, eventId, conversationId } = await request.json();
    
    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    // Check if event exists
    let event = null;
    if (isDbConnected) {
      event = await Event.findById(eventId);
    } else {
      event = inMemoryEvents.get(eventId);
      // Create mock event if it doesn't exist
      if (!event) {
        event = {
          _id: eventId,
          name: 'Demo Event',
          feedbackCount: 0
        };
        inMemoryEvents.set(eventId, event);
      }
    }
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get or create feedback document
    let feedback: IFeedback | any = null;
    
    // Check in-memory cache first
    const cachedConversation = activeConversations.get(conversationId);
    if (cachedConversation) {
      feedback = cachedConversation.data;
      // Update last accessed time
      cachedConversation.lastAccessed = Date.now();
    } else {
      // Not in cache, check database or in-memory storage
      if (isDbConnected) {
        feedback = await Feedback.findOne({ conversationId });
      } else {
        feedback = inMemoryFeedback.get(conversationId);
      }
    }
    
    // Get request metadata
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const ipAddress = (
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') ||
      'unknown'
    ).split(',')[0]; // Take first IP if multiple are provided
    
    // If the feedback doesn't exist, create a new one
    if (!feedback) {
      feedback = {
        eventId,
        conversationId,
        messages: [{ 
          role: 'system', 
          content: 'You are an event feedback assistant. Your job is to collect feedback about an event in a friendly, conversational manner.',
          timestamp: new Date()
        }],
        responses: {},
        completed: false,
        userAgent,
        ipAddress
      };
      
      // Save to database or in-memory store
      if (isDbConnected) {
        const feedbackModel = new Feedback(feedback);
        await feedbackModel.save();
      } else {
        inMemoryFeedback.set(conversationId, feedback);
      }
      
      // Add to cache
      activeConversations.set(conversationId, {
        lastAccessed: Date.now(),
        data: feedback
      });
    }
    
    // Add user message to conversation history
    feedback.messages.push({ 
      role: 'user', 
      content: message,
      timestamp: new Date()
    });
    
    // Get current question index (default to -1 if not set)
    let currentQuestionIndex = -1;
    
    // Find the current question index by checking which questions have been answered
    if (!feedback.completed) {
      for (let i = 0; i < QUESTIONS.length; i++) {
        if (feedback.responses[QUESTIONS[i].id] === undefined) {
          currentQuestionIndex = i - 1;
          break;
        }
      }
      
      // If all questions have been answered, set to the last question
      if (currentQuestionIndex === -1 && Object.keys(feedback.responses).length === QUESTIONS.length) {
        currentQuestionIndex = QUESTIONS.length - 1;
      }
    }
    
    // Process the user's message
    let responseMessage = '';
    let isComplete = false;
    
    // If this is a response to a question
    if (currentQuestionIndex >= 0) {
      const currentQuestion = QUESTIONS[currentQuestionIndex];
      
      // Validate input based on question type
      let isValid = true;
      let validationMessage = '';
      
      if (currentQuestion.type === 'rating') {
        const rating = parseInt(message);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          isValid = false;
          validationMessage = "Please provide a rating between 1 and 5.";
        }
      } else if (currentQuestion.type === 'yesno') {
        const lowerMsg = message.toLowerCase();
        if (!lowerMsg.includes('yes') && !lowerMsg.includes('no') && 
            !lowerMsg.includes('yeah') && !lowerMsg.includes('nope') && 
            !lowerMsg.includes('sure') && !lowerMsg.includes('nah')) {
          isValid = false;
          validationMessage = "Please answer with a yes or no.";
        }
      }
      
      if (!isValid) {
        // Add assistant message to conversation history
        feedback.messages.push({ 
          role: 'assistant', 
          content: validationMessage,
          timestamp: new Date()
        });
        
        // Save to database or in-memory store
        if (isDbConnected) {
          await feedback.save();
        } else {
          inMemoryFeedback.set(conversationId, feedback);
        }
        
        return NextResponse.json({
          message: validationMessage,
          isComplete: false,
        });
      }
      
      // Store the user's response
      feedback.responses[currentQuestion.id] = message;
      
      // For text responses, analyze sentiment
      if (currentQuestion.type === 'text') {
        try {
          const sentiment = await analyzeSentiment(message);
          feedback.responses[`${currentQuestion.id}_sentiment`] = sentiment;
        } catch (error) {
          console.error('Error analyzing sentiment:', error);
        }
      }
      
      // Move to the next question or end the conversation
      currentQuestionIndex++;
      
      if (currentQuestionIndex < QUESTIONS.length) {
        // Get the next question
        const nextQuestion = QUESTIONS[currentQuestionIndex];
        
        // For follow-up questions, personalize based on previous responses
        if (currentQuestionIndex > 0) {
          const prevQuestion = QUESTIONS[currentQuestionIndex - 1];
          const prevResponse = feedback.responses[prevQuestion.id];
          
          if (prevQuestion.type === 'rating' && prevResponse && parseInt(prevResponse) <= 2 && nextQuestion.id === 'improvements') {
            // If previous rating was low, ask specifically about that aspect
            responseMessage = `I noticed you rated ${prevQuestion.id} quite low. ${nextQuestion.text} Specifically, what about the ${prevQuestion.id} could be better?`;
          } else {
            responseMessage = nextQuestion.text;
          }
        } else {
          responseMessage = nextQuestion.text;
        }
      } else {
        // Feedback complete - generate a personalized thank you message using OpenAI
        try {
          // Add system instruction for generating the conclusion
          const messagesToSend: ChatMessage[] = feedback.messages.map((msg: ConversationMessage) => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content
          }));
          
          messagesToSend.push({ 
            role: 'system', 
            content: 'Create a friendly thank you message for completing the feedback. Mention that their feedback will help improve future events.' 
          });
          
          // Generate the conclusion message
          const aiResponse = await generateChatResponse(messagesToSend);
          
          // Use the generated response or fall back to default
          responseMessage = aiResponse || "Thank you for your valuable feedback! Your insights will help us improve future events.";
        } catch (error) {
          console.error('Error generating conclusion message:', error);
          responseMessage = "Thank you for your valuable feedback! Your insights will help us improve future events.";
        }
        
        feedback.completed = true;
        isComplete = true;
        
        // Update event feedback count
        await Event.findByIdAndUpdate(eventId, { $inc: { feedbackCount: 1 } });
      }
    } else {
      // Initial interaction - Check if user wants to provide feedback
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('yes') || lowerMsg.includes('sure') || lowerMsg.includes('okay') || 
          lowerMsg.includes('ok') || lowerMsg.includes('fine') || lowerMsg.includes('yeah')) {
        currentQuestionIndex = 0;
        responseMessage = QUESTIONS[0].text;
      } else {
        // Generate a conversational response using OpenAI
        try {
          // Add system instruction for initial rejection response
          const messagesToSend: ChatMessage[] = feedback.messages.map((msg: ConversationMessage) => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content
          }));
          
          messagesToSend.push({ 
            role: 'system', 
            content: 'The user seems hesitant to provide feedback. Respond in a friendly way, acknowledging their response, and gently encourage them to provide feedback when they\'re ready by saying "yes".' 
          });
          
          // Generate the response
          const aiResponse = await generateChatResponse(messagesToSend);
          
          // Use the generated response or fall back to default
          responseMessage = aiResponse || "I understand. Whenever you're ready to provide feedback, just let me know by saying 'yes'.";
        } catch (error) {
          console.error('Error generating response:', error);
          responseMessage = "I understand. Whenever you're ready to provide feedback, just let me know by saying 'yes'.";
        }
      }
    }
    
    // Add assistant message to conversation history
    feedback.messages.push({ 
      role: 'assistant', 
      content: responseMessage,
      timestamp: new Date()
    });
    
    // Save to database or in-memory store
    if (isDbConnected) {
      await feedback.save();
    } else {
      inMemoryFeedback.set(conversationId, feedback);
    }
    
    // Update cache
    activeConversations.set(conversationId, {
      lastAccessed: Date.now(),
      data: feedback
    });
    
    return NextResponse.json({
      message: responseMessage,
      isComplete,
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}