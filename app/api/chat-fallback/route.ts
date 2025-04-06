export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  getStaticResponse, 
  getBasicSentimentAnalysis, 
  generateConclusionMessage 
} from '../../utils/staticResponses';

// In-memory conversation storage
const conversations = new Map<string, {
  conversationId: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: Date;
  }>;
  responses: Record<string, string>;
  completed: boolean;
  currentQuestionIndex: number;
}>();

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

export async function POST(request: NextRequest) {
  try {
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
    
    // Get or create conversation
    let conversation = conversations.get(conversationId);
    
    if (!conversation) {
      conversation = {
        conversationId,
        messages: [{ 
          role: 'system', 
          content: 'You are an event feedback assistant. Your job is to collect feedback about an event in a friendly, conversational manner.',
          timestamp: new Date()
        }],
        responses: {},
        completed: false,
        currentQuestionIndex: -1
      };
      conversations.set(conversationId, conversation);
    }
    
    // Add user message to conversation history
    conversation.messages.push({ 
      role: 'user', 
      content: message,
      timestamp: new Date()
    });
    
    // Process the user's message
    let responseMessage = '';
    let isComplete = false;
    
    // If this is a response to a question
    if (conversation.currentQuestionIndex >= 0) {
      const currentQuestion = QUESTIONS[conversation.currentQuestionIndex];
      
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
        conversation.messages.push({ 
          role: 'assistant', 
          content: validationMessage,
          timestamp: new Date()
        });
        
        return NextResponse.json({
          message: validationMessage,
          isComplete: false,
        });
      }
      
      // Store the user's response
      conversation.responses[currentQuestion.id] = message;
      
      // For text responses, analyze sentiment
      if (currentQuestion.type === 'text') {
        try {
          const sentiment = getBasicSentimentAnalysis(message);
          conversation.responses[`${currentQuestion.id}_sentiment`] = sentiment;
        } catch (error) {
          console.error('Error analyzing sentiment:', error);
        }
      }
      
      // Move to the next question or end the conversation
      conversation.currentQuestionIndex++;
      
      if (conversation.currentQuestionIndex < QUESTIONS.length) {
        // Get the next question
        const nextQuestion = QUESTIONS[conversation.currentQuestionIndex];
        
        // For follow-up questions, personalize based on previous responses
        if (conversation.currentQuestionIndex > 0) {
          const prevQuestion = QUESTIONS[conversation.currentQuestionIndex - 1];
          const prevResponse = conversation.responses[prevQuestion.id];
          
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
        // Feedback complete - generate a personalized thank you message
        responseMessage = generateConclusionMessage(conversation.messages);
        conversation.completed = true;
        isComplete = true;
      }
    } else {
      // Initial interaction - Check if user wants to provide feedback
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('yes') || lowerMsg.includes('sure') || lowerMsg.includes('okay') || 
          lowerMsg.includes('ok') || lowerMsg.includes('fine') || lowerMsg.includes('yeah')) {
        conversation.currentQuestionIndex = 0;
        responseMessage = QUESTIONS[0].text;
      } else {
        // Use static response system to generate an appropriate response
        responseMessage = getStaticResponse(message);
      }
    }
    
    // Add assistant message to conversation history
    conversation.messages.push({ 
      role: 'assistant', 
      content: responseMessage,
      timestamp: new Date()
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