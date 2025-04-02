import { OpenAI } from 'openai';
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

// Initialize the NVIDIA API client
const nvidiaNlp = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: "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"
});

/**
 * Generates a response from NVIDIA API based on the conversation history
 * @param messages The conversation history
 * @returns The AI-generated response
 */
export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided for chat completion');
    }

    // Call NVIDIA API
    const response = await nvidiaNlp.chat.completions.create({
      model: "deepseek-ai/deepseek-r1",
      messages: messages,
      temperature: 0.6,
      top_p: 0.7,
      max_tokens: 1000,
      stream: false
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response generated from NVIDIA API');
    }

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating chat response from NVIDIA API:', error);
    
    // Fall back to static responses if API fails
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

    // Call NVIDIA API for sentiment analysis
    const response = await nvidiaNlp.chat.completions.create({
      model: "deepseek-ai/deepseek-r1",
      messages,
      temperature: 0.3,
      top_p: 0.7,
      max_tokens: 250,
      stream: false
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response generated from NVIDIA API');
    }

    return response.choices[0].message.content || 'Neutral sentiment';
  } catch (error) {
    console.error('Error analyzing sentiment with NVIDIA API:', error);
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

export default {
  generateChatResponse: rateLimitedGenerateChatResponse,
  analyzeSentiment: rateLimitedAnalyzeSentiment
}; 