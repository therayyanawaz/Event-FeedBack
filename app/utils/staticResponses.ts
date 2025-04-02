/**
 * Static responses for the event feedback chatbot
 * 
 * This file contains a comprehensive collection of pre-defined prompts and responses
 * to use when the OpenAI API is unavailable or to reduce API costs.
 */

// Types of prompts and intents
export type IntentType = 
  | 'greeting'
  | 'farewell'
  | 'rating_positive'
  | 'rating_neutral'
  | 'rating_negative'
  | 'content_feedback'
  | 'speaker_feedback'
  | 'venue_feedback'
  | 'food_feedback'
  | 'schedule_feedback'
  | 'tech_issues'
  | 'praise'
  | 'complaint'
  | 'question'
  | 'suggestion'
  | 'completion'
  | 'chitchat'
  | 'fallback';

// Interface for response templates
interface ResponseTemplate {
  intent: IntentType;
  keywords: string[];
  responses: string[];
}

/**
 * Collection of response templates for different intents
 */
export const responseTemplates: ResponseTemplate[] = [
  {
    intent: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'start'],
    responses: [
      "Hello! I'm your friendly feedback assistant for this event. Would you like to share your thoughts about your experience today?",
      "Hi there! I'd love to hear your feedback about the event. Would you like to share your thoughts?",
      "Welcome! I'm here to collect your valuable feedback about the event. Ready to share your experience?",
      "Greetings! Thank you for taking the time to provide feedback. How was your experience at the event?",
      "Hello! Your opinion matters to us. Would you like to share your thoughts about today's event?"
    ]
  },
  {
    intent: 'farewell',
    keywords: ['bye', 'goodbye', 'see you', 'farewell', 'cya', 'ttyl', 'later', 'end'],
    responses: [
      "Thank you for your feedback! It will help us improve future events. Have a great day!",
      "Thanks for sharing your thoughts with us. Your feedback is incredibly valuable. Goodbye!",
      "Your input is greatly appreciated. Thank you for taking the time to provide feedback. Farewell!",
      "We appreciate you taking the time to share your feedback. Have a wonderful day!",
      "Thank you for your valuable insights. They will contribute to making our future events even better. Goodbye!"
    ]
  },
  {
    intent: 'rating_positive',
    keywords: ['5', '4', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'loved', 'enjoyed', 'awesome', 'good', 'terrific'],
    responses: [
      "That's wonderful to hear! We're thrilled you had such a positive experience.",
      "Excellent! We're glad you enjoyed that aspect of the event.",
      "Fantastic! Thank you for your positive feedback.",
      "We're delighted to hear you had such a great experience!",
      "That's great feedback! We aim to create enjoyable experiences for all attendees."
    ]
  },
  {
    intent: 'rating_neutral',
    keywords: ['3', 'ok', 'okay', 'fine', 'average', 'moderate', 'mediocre', 'middle', 'neutral', 'satisfactory'],
    responses: [
      "Thanks for your feedback. We're always looking to improve from satisfactory to exceptional.",
      "I appreciate your honest assessment. What could we have done to make it better?",
      "Thank you for that feedback. We strive to exceed expectations and will work on improving this area.",
      "Your candid feedback helps us improve. What specific changes would you suggest?",
      "We appreciate your honest rating. Would you like to elaborate on what could have been better?"
    ]
  },
  {
    intent: 'rating_negative',
    keywords: ['1', '2', 'bad', 'poor', 'terrible', 'awful', 'disappointed', 'unhappy', 'worst', 'not good', 'disliked'],
    responses: [
      "I'm sorry to hear that you didn't have a positive experience. Your feedback helps us identify areas for improvement.",
      "We apologize for not meeting your expectations. Could you share more details about what went wrong?",
      "Thank you for bringing this to our attention. We take all feedback seriously and will work to address these issues.",
      "We're sorry to hear about your experience. Your feedback is valuable in helping us improve future events.",
      "I apologize for your disappointing experience. Would you mind sharing what specifically could have been better?"
    ]
  },
  {
    intent: 'content_feedback',
    keywords: ['content', 'topic', 'subject', 'material', 'information', 'lecture', 'presentation', 'talk', 'speech', 'slides'],
    responses: [
      "Thank you for your feedback on the content. This helps us refine our topics for future events.",
      "We appreciate your insights about the content. How do you think we could improve it further?",
      "Your feedback on the presentation content is valuable. We'll take this into account for future events.",
      "Thank you for sharing your thoughts on the topics covered. Was there anything specific you would have liked to see included?",
      "We value your opinion on the content. This helps us ensure we're delivering relevant and engaging material."
    ]
  },
  {
    intent: 'speaker_feedback',
    keywords: ['speaker', 'presenter', 'host', 'lecturer', 'talked', 'speaking', 'presented', 'facilitator', 'moderator'],
    responses: [
      "Thank you for your feedback about the speakers. We'll share this with them.",
      "We appreciate your thoughts on the presenters. This helps us in selecting speakers for future events.",
      "Your feedback on the speakers is valuable. We strive to feature engaging and knowledgeable presenters.",
      "Thank you for sharing your impressions of the speakers. Was there a particular presenter you found especially effective?",
      "We value your opinion on the presenters. This helps us enhance the quality of presentations at future events."
    ]
  },
  {
    intent: 'venue_feedback',
    keywords: ['venue', 'location', 'place', 'room', 'hall', 'space', 'facility', 'building', 'site', 'accommodation', 'seating'],
    responses: [
      "Thank you for your feedback on the venue. We want to ensure comfortable and accessible locations for our events.",
      "We appreciate your thoughts on the location. This helps us select suitable venues in the future.",
      "Your feedback on the facilities is valuable. We aim to provide comfortable spaces for all attendees.",
      "Thank you for sharing your experience with the venue. Was there anything specific about the location that affected your experience?",
      "We value your opinion on the event space. This helps us improve the physical aspects of our events."
    ]
  },
  {
    intent: 'food_feedback',
    keywords: ['food', 'catering', 'meal', 'snack', 'drink', 'refreshment', 'lunch', 'dinner', 'breakfast', 'coffee', 'beverage'],
    responses: [
      "Thank you for your feedback on the catering. We aim to provide quality refreshments at our events.",
      "We appreciate your thoughts on the food and beverages. This helps us improve our catering selections.",
      "Your feedback on the refreshments is valuable. We'll keep this in mind when planning future events.",
      "Thank you for sharing your experience with the catering. Was there anything specific you'd like to see offered in the future?",
      "We value your opinion on the food service. This helps us ensure we're meeting attendees' needs."
    ]
  },
  {
    intent: 'schedule_feedback',
    keywords: ['schedule', 'agenda', 'timing', 'duration', 'length', 'time', 'program', 'itinerary', 'timetable', 'breaks', 'long', 'short'],
    responses: [
      "Thank you for your feedback on the schedule. We try to balance content and breaks effectively.",
      "We appreciate your thoughts on the event timing. This helps us plan better agendas in the future.",
      "Your feedback on the program structure is valuable. We aim to create engaging and well-paced events.",
      "Thank you for sharing your experience with the timing. Was there any part that felt particularly rushed or drawn out?",
      "We value your opinion on the schedule. This helps us optimize the flow of future events."
    ]
  },
  {
    intent: 'tech_issues',
    keywords: ['technical', 'tech', 'audio', 'video', 'sound', 'microphone', 'projector', 'screen', 'connection', 'wifi', 'internet', 'streaming'],
    responses: [
      "I'm sorry to hear about the technical issues. We'll work to ensure better technical support in the future.",
      "Thank you for pointing out these technical problems. We strive to provide seamless experiences and will address these issues.",
      "We apologize for the technical difficulties you experienced. Your feedback helps us improve our technical setup.",
      "Thank you for bringing these technical issues to our attention. We'll work with our tech team to prevent similar problems.",
      "We value your patience with the technical challenges. This feedback is crucial for improving our technical arrangements."
    ]
  },
  {
    intent: 'praise',
    keywords: ['loved', 'enjoyed', 'appreciate', 'thank', 'grateful', 'impressed', 'amazing', 'excellent', 'outstanding', 'perfect', 'best'],
    responses: [
      "We're delighted to hear your positive feedback! It's wonderful to know you had such a great experience.",
      "Thank you for your kind words! We're thrilled that you enjoyed the event.",
      "We're so pleased you had a positive experience. Comments like yours make all the hard work worthwhile!",
      "That's wonderful to hear! We're committed to creating valuable experiences for our attendees.",
      "We're honored by your praise! Thank you for taking the time to share your positive experience."
    ]
  },
  {
    intent: 'complaint',
    keywords: ['complaint', 'disappointed', 'unhappy', 'dissatisfied', 'upset', 'frustrating', 'annoying', 'problem', 'issue', 'concern'],
    responses: [
      "I'm sorry to hear about your experience. We take your feedback seriously and will work to address these issues.",
      "Thank you for bringing this to our attention. We apologize for not meeting your expectations and will use this feedback to improve.",
      "We're disappointed to hear about these issues. Your feedback is valuable in helping us identify areas for improvement.",
      "I apologize for your negative experience. We strive to deliver high-quality events and will work to resolve these concerns.",
      "Thank you for your candid feedback. We're committed to improving and will take your comments into consideration."
    ]
  },
  {
    intent: 'question',
    keywords: ['?', 'how', 'what', 'when', 'where', 'why', 'who', 'which', 'will', 'can', 'could', 'would', 'should', 'do'],
    responses: [
      "That's a great question. While I'm primarily here to collect feedback, I'd be happy to pass this inquiry along to the event organizers.",
      "Thank you for your question. I'm focusing on gathering feedback about your experience, but I can ensure the organizers receive your question.",
      "I appreciate your inquiry. My main purpose is to collect event feedback, but I'll make sure the appropriate team receives your question.",
      "While I'm designed to gather feedback rather than answer specific questions about the event, I'll ensure your question reaches the right people.",
      "Thanks for asking. I'm here mainly to collect your feedback about the event, but I can make sure your question gets to the event team."
    ]
  },
  {
    intent: 'suggestion',
    keywords: ['suggest', 'suggestion', 'recommend', 'recommendation', 'idea', 'improvement', 'better', 'enhance', 'consider', 'propose'],
    responses: [
      "Thank you for your suggestion! We value ideas that can help us improve future events.",
      "That's a thoughtful recommendation. We appreciate you taking the time to share your ideas for improvement.",
      "Thank you for this constructive suggestion. We're always looking for ways to enhance the experience for our attendees.",
      "We appreciate your ideas for improvement. Feedback like yours helps us make positive changes.",
      "That's a valuable suggestion! We'll definitely consider this when planning our next event."
    ]
  },
  {
    intent: 'completion',
    keywords: ['done', 'finished', 'complete', 'completed', 'that\'s all', 'that is all', 'nothing else', 'no more', 'end'],
    responses: [
      "Thank you for completing the feedback process! Your insights are incredibly valuable and will help us improve future events.",
      "We truly appreciate you taking the time to share your thoughts with us. Your feedback will directly impact how we plan and execute future events.",
      "Thank you for your valuable feedback! Your input helps us create better experiences for everyone. We hope to see you at future events!",
      "Your feedback is complete and has been recorded. We're grateful for your participation and thoughtful responses.",
      "Thank you for sharing your experience with us. Your feedback is invaluable and will help shape our future events to better meet attendees' needs."
    ]
  },
  {
    intent: 'chitchat',
    keywords: ['how are you', 'weather', 'nice', 'chat', 'talk', 'tell me', 'your name', 'who are you', 'about you'],
    responses: [
      "I'm a feedback assistant focused on gathering your thoughts about the event. I'd love to hear about your experience!",
      "I'm here specifically to collect your valuable feedback about the event. Would you like to share your thoughts?",
      "Thanks for chatting! My purpose is to gather your feedback about today's event. What aspects would you like to comment on?",
      "I'm designed to help collect your insights about the event. Your feedback is what I'm really interested in hearing!",
      "I appreciate your friendliness! I'm focused on understanding your event experience. Would you like to share what you thought of it?"
    ]
  },
  {
    intent: 'fallback',
    keywords: [],
    responses: [
      "Thank you for your message. I'd love to hear more about your experience at the event. Could you share what aspects you enjoyed or what could be improved?",
      "I appreciate your feedback. To help us better understand your experience, could you elaborate on specific aspects of the event?",
      "Thank you for sharing. Your feedback is valuable to us. Is there anything specific about the event you'd like to comment on?",
      "I'm interested in hearing more about your event experience. Would you mind sharing some details about what worked well or what could be better?",
      "Thank you for your input. To gather comprehensive feedback, could you tell me more about particular elements of the event that stood out to you?"
    ]
  }
];

/**
 * Get a response for a given user message
 * @param message The user's message
 * @returns An appropriate response based on message content
 */
export function getStaticResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Find matching intent based on keywords
  let matchedIntent: IntentType = 'fallback';
  let highestMatchCount = 0;
  
  responseTemplates.forEach(template => {
    let matchCount = 0;
    
    template.keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    });
    
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      matchedIntent = template.intent;
    }
  });
  
  // Get responses for the matched intent
  const templateData = responseTemplates.find(t => t.intent === matchedIntent);
  if (!templateData || templateData.responses.length === 0) {
    return "Thank you for your feedback. Your insights are valuable to us!";
  }
  
  // Select a random response from the available options
  const randomIndex = Math.floor(Math.random() * templateData.responses.length);
  return templateData.responses[randomIndex];
}

/**
 * Determine sentiment based on basic keyword analysis
 * @param text The text to analyze
 * @returns A sentiment analysis result
 */
export function getBasicSentimentAnalysis(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Define sentiment keywords
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'enjoyed', 
    'love', 'best', 'perfect', 'awesome', 'brilliant', 'outstanding', 'terrific',
    'happy', 'pleased', 'satisfied', 'impressive', 'thank', 'appreciate', 'grateful'
  ];
  
  const negativeWords = [
    'bad', 'poor', 'terrible', 'awful', 'worst', 'hate', 'dislike', 'disappointed',
    'boring', 'waste', 'frustrating', 'annoying', 'confusing', 'difficult', 'unhappy',
    'issue', 'problem', 'disappoint', 'lacking', 'mediocre', 'unpleasant', 'uncomfortable'
  ];
  
  // Count sentiment matches
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  // Extract key themes (basic implementation)
  const possibleThemes = [
    'content', 'speakers', 'venue', 'food', 'schedule', 'organization',
    'networking', 'staff', 'price', 'value', 'technology', 'audio', 'video'
  ];
  
  const detectedThemes: string[] = [];
  possibleThemes.forEach(theme => {
    if (lowerText.includes(theme)) {
      detectedThemes.push(theme);
    }
  });
  
  // Generate sentiment analysis
  let sentimentResult = "";
  
  if (positiveCount > negativeCount) {
    sentimentResult += "Sentiment: Positive. ";
    if (positiveCount > 3) {
      sentimentResult += "The feedback is highly positive. ";
    } else {
      sentimentResult += "The feedback contains positive elements. ";
    }
  } else if (negativeCount > positiveCount) {
    sentimentResult += "Sentiment: Negative. ";
    if (negativeCount > 3) {
      sentimentResult += "The feedback is highly critical. ";
    } else {
      sentimentResult += "The feedback highlights areas for improvement. ";
    }
  } else {
    sentimentResult += "Sentiment: Neutral. ";
    if (positiveCount > 0 || negativeCount > 0) {
      sentimentResult += "The feedback contains mixed or balanced opinions. ";
    } else {
      sentimentResult += "The feedback is factual without strong sentiment. ";
    }
  }
  
  // Add theme information
  if (detectedThemes.length > 0) {
    sentimentResult += `Key themes mentioned: ${detectedThemes.join(', ')}.`;
  } else {
    sentimentResult += "No specific themes clearly identified in the feedback.";
  }
  
  return sentimentResult;
}

/**
 * Generate a personalized conclusion message
 * @param messages The conversation history
 * @returns A conclusion thanking the user for their feedback
 */
export function generateConclusionMessage(messages: any[]): string {
  // Default conclusion messages
  const conclusions = [
    "Thank you for taking the time to provide such detailed feedback! Your insights are invaluable and will help us improve future events. We hope to see you at our next gathering!",
    "We truly appreciate your thoughtful feedback. Your comments will directly influence how we plan and organize upcoming events. Thank you for helping us create better experiences!",
    "Thank you for sharing your experience with us. Your feedback is extremely valuable and will be carefully considered as we work to enhance our future events. We're grateful for your participation!",
    "We can't thank you enough for your comprehensive feedback. Your insights help us understand what works well and where we can improve. We look forward to implementing changes based on your suggestions!",
    "Your feedback is a gift that helps us grow and improve. Thank you for taking the time to share your thoughts with us. We're committed to creating even better experiences in the future!"
  ];
  
  // Get a random conclusion message
  const randomIndex = Math.floor(Math.random() * conclusions.length);
  return conclusions[randomIndex];
}

export default {
  getStaticResponse,
  getBasicSentimentAnalysis,
  generateConclusionMessage,
  responseTemplates
}; 