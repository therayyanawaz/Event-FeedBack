import OpenAI from 'openai';
import { 
  getStaticResponse,
  getBasicSentimentAnalysis,
  generateConclusionMessage 
} from './staticResponses';

// Define the message type for better type safety
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Initialize the OpenAI client with your API key if available
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

/**
 * Generates a response from OpenAI based on the conversation history
 * @param messages The conversation history
 * @returns The AI-generated response
 */
export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key is not configured, using static response system');
      
      // Extract the last user message
      const lastUserMessage = [...messages]
        .reverse()
        .find(m => m.role === 'user');
      
      // Check if there's a system message at the end requesting a conclusion
      const lastSystemMessage = messages[messages.length - 1];
      if (lastSystemMessage?.role === 'system' && 
          lastSystemMessage.content.includes('thank you') && 
          lastSystemMessage.content.includes('conclusion')) {
        return generateConclusionMessage(messages);
      }
      
      if (lastUserMessage) {
        return getStaticResponse(lastUserMessage.content);
      }
      
      return "Thank you for your feedback. Your insights are valuable to us!";
    }

    if (!messages || messages.length === 0) {
      throw new Error('No messages provided for chat completion');
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    return response.choices[0].message.content || '';
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Handle API errors specifically
      console.error(`OpenAI API Error (${error.status}): ${error.message}`);
      // Handle rate limiting - you could implement retry logic here
      if (error.status === 429) {
        console.error('Rate limit exceeded. Consider implementing backoff/retry.');
      }
    } else {
      console.error('Error generating chat response:', error);
    }
    
    // Fall back to static responses
    const lastUserMessage = [...messages]
      .reverse()
      .find(m => m.role === 'user');
      
    if (lastUserMessage) {
      return getStaticResponse(lastUserMessage.content);
    }
    
    return "Thank you for your feedback. We appreciate your input!";
  }
}

/**
 * Analyzes the sentiment of feedback text
 * @param text The feedback text to analyze
 * @returns The sentiment analysis result
 */
export async function analyzeSentiment(text: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key is not configured, using static sentiment analysis');
      return getBasicSentimentAnalysis(text);
    }

    if (!text || text.trim() === '') {
      return 'No content provided for sentiment analysis';
    }

    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: 'You are a sentiment analysis tool. Analyze the sentiment of the following feedback and classify it as positive, negative, or neutral. Also extract key themes or topics mentioned in a structured format.' 
      },
      { 
        role: 'user', 
        content: text 
      }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.3,
      max_tokens: 150,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    return response.choices[0].message.content || 'Neutral sentiment';
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`OpenAI API Error (${error.status}): ${error.message}`);
    } else {
      console.error('Error analyzing sentiment:', error);
    }
    // Return the basic sentiment analysis as fallback
    return getBasicSentimentAnalysis(text);
  }
}

// Add a rate limiter to prevent abuse
export const rateLimitedGenerateChatResponse = createRateLimiter(generateChatResponse, 10, 60000);
export const rateLimitedAnalyzeSentiment = createRateLimiter(analyzeSentiment, 10, 60000);

// Helper function to create a rate limiter
function createRateLimiter<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxCalls: number,
  timeWindow: number
): T {
  const calls: number[] = [];
  
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();
    
    // Remove calls outside the time window
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }
    
    // Check if we've exceeded the rate limit
    if (calls.length >= maxCalls) {
      throw new Error(`Rate limit of ${maxCalls} calls per ${timeWindow/1000}s exceeded`);
    }
    
    // Add this call to the list
    calls.push(now);
    
    // Call the original function
    return fn(...args);
  }) as T;
}

export default openai; 