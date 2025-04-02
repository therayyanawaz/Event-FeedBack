import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import UserInput from './UserInput';
import { v4 as uuidv4 } from 'uuid';

type MessageType = {
  id: string;
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

type ChatProps = {
  eventId: string;
  onFeedbackComplete?: () => void;
};

const Chat: React.FC<ChatProps> = ({ eventId, onFeedbackComplete }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message when component mounts
  useEffect(() => {
    const greetingMessage = {
      id: uuidv4(),
      content: "Hello! I'm your friendly feedback assistant for this event. Would you like to share your thoughts about your experience today?",
      sender: 'bot' as const,
      timestamp: new Date(),
    };
    
    setMessages([greetingMessage]);
    setIsTyping(false);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend API
  const processMessage = async (userMessage: string) => {
    try {
      // Add user message to chat
      const newUserMessage = {
        id: uuidv4(),
        content: userMessage,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setIsTyping(true);
      
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          eventId,
          conversationId,
        }),
      });
      
      const data = await response.json();
      
      // Add bot response to chat
      const botResponse = {
        id: uuidv4(),
        content: data.message,
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
      
      // Check if feedback session is complete
      if (data.isComplete && onFeedbackComplete) {
        onFeedbackComplete();
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage = {
        id: uuidv4(),
        content: "I'm sorry, I'm having trouble processing your message. Please try again.",
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Event Feedback</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <Message
            key={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <UserInput onSendMessage={processMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Chat; 