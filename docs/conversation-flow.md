# Chatbot Conversation Flow

This document outlines the conversation flow design for the Event Feedback Chatbot.

## Overview

The chatbot uses a structured conversation flow to collect feedback about various aspects of an event. The flow is designed to feel natural while ensuring all necessary feedback is collected.

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Greeting  │────▶│  Questions  │────▶│  Conclusion │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  Follow-up  │
                    │  Questions  │
                    └─────────────┘
```

## Conversation States

### 1. Greeting

The chatbot begins with a friendly greeting and explanation of purpose:

```
"Hello! I'm your friendly feedback assistant for [Event Name]. Would you like to share your thoughts about your experience today?"
```

- If the user responds positively (contains "yes"), the chatbot proceeds to the first question
- If the user responds negatively, the chatbot acknowledges and waits for the user to indicate readiness

### 2. Main Questions

The chatbot asks a series of questions about different aspects of the event:

1. **Overall Experience**
   ```
   "On a scale of 1-5, how would you rate your overall experience at the event?"
   ```

2. **Content Quality**
   ```
   "How satisfied were you with the content and topics covered? (1-5)"
   ```

3. **Speaker Quality**
   ```
   "How would you rate the speakers and presenters? (1-5)"
   ```

4. **Venue and Facilities**
   ```
   "How satisfied were you with the venue and facilities? (1-5)"
   ```

5. **Highlights**
   ```
   "What were the highlights of the event for you?"
   ```

6. **Improvement Areas**
   ```
   "What aspects of the event could be improved?"
   ```

7. **Future Interest**
   ```
   "Would you be interested in attending similar events in the future?"
   ```

### 3. Follow-up Questions

The chatbot may ask follow-up questions based on previous responses:

- For low ratings (1-2):
  ```
  "I notice you rated [aspect] quite low. Could you please elaborate on what specifically didn't meet your expectations?"
  ```

- For high ratings (4-5):
  ```
  "Great! Could you share what specifically you enjoyed about [aspect]?"
  ```

### 4. Conclusion

Once all feedback is collected, the chatbot concludes the conversation:

```
"Thank you for your valuable feedback! Your insights will help us improve future events."
```

## Input Validation

The chatbot validates user input to ensure quality feedback:

- **Rating Validation**: Ensures ratings are within the specified range (1-5)
- **Text Response Validation**: Checks that text responses have sufficient content
- **Yes/No Validation**: Interprets various forms of affirmative/negative responses correctly

## Adaptive Behavior

The conversation flow adapts based on:

1. **User Engagement**: If a user provides detailed responses, the chatbot may ask fewer follow-up questions
2. **Response Patterns**: The chatbot may focus more on areas where the user seems to have stronger opinions
3. **Time Sensitivity**: The chatbot can adjust the number of questions based on the user's available time

## Error Handling

If the user provides unexpected or invalid input, the chatbot handles it gracefully:

```
"I'm not sure I understood that response. Could you please try again with a rating from 1 to 5?"
```

## Future Enhancements

Planned improvements to the conversation flow:

1. **Sentiment Analysis**: Automatically detect sentiment in free-text responses
2. **Natural Language Understanding**: Better interpret varied user responses
3. **Personalization**: Adjust conversation style based on user communication patterns
4. **Memory**: Reference previous feedback for returning attendees 