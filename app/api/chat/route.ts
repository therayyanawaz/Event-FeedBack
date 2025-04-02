import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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

// In-memory storage for conversations (should be replaced with database in production)
const conversations = new Map();

export async function POST(request: Request) {
  try {
    const { message, eventId, conversationId } = await request.json();
    
    if (!message || !eventId || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get or initialize conversation state
    let conversation = conversations.get(conversationId);
    if (!conversation) {
      conversation = {
        eventId,
        currentQuestionIndex: -1, // Start at -1 so first increment sets to 0
        responses: {},
        isComplete: false,
      };
      conversations.set(conversationId, conversation);
    }
    
    // Process the user's message
    let responseMessage = '';
    let isComplete = false;
    
    // If this is a response to a question
    if (conversation.currentQuestionIndex >= 0) {
      const currentQuestion = QUESTIONS[conversation.currentQuestionIndex];
      
      // Store the user's response
      conversation.responses[currentQuestion.id] = message;
      
      // Move to the next question or end the conversation
      conversation.currentQuestionIndex++;
      
      if (conversation.currentQuestionIndex < QUESTIONS.length) {
        // Get the next question
        const nextQuestion = QUESTIONS[conversation.currentQuestionIndex];
        responseMessage = nextQuestion.text;
      } else {
        // Feedback complete
        responseMessage = "Thank you for your valuable feedback! Your insights will help us improve future events.";
        conversation.isComplete = true;
        isComplete = true;
        
        // Here you would typically store the feedback in a database
        console.log('Feedback collected:', conversation.responses);
      }
    } else {
      // Initial interaction
      if (message.toLowerCase().includes('yes')) {
        conversation.currentQuestionIndex = 0;
        responseMessage = QUESTIONS[0].text;
      } else {
        responseMessage = "I understand. Whenever you're ready to provide feedback, just let me know by saying 'yes'.";
      }
    }
    
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