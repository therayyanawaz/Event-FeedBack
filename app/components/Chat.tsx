import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';
import ChatInput from './ChatInput';

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
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsInitializing(true);
        
        // Simulate API delay for initialization
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const greetingMessage = {
          id: uuidv4(),
          content: "Hello! I'm your friendly feedback assistant for this event. Would you like to share your thoughts about your experience today?",
          sender: 'bot' as const,
          timestamp: new Date(),
        };
        
        setMessages([greetingMessage]);
        setIsInitializing(false);
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('There was a problem starting the chat. Please try again later.');
        setIsInitializing(false);
      }
    };
    
    initializeChat();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend API
  const processMessage = async (userMessage: string) => {
    try {
      setError(null);
      
      // Add user message to chat
      const newUserMessage = {
        id: uuidv4(),
        content: userMessage,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setIsTyping(true);
      
      // Try main API first, fallback to in-memory version if it fails
      let responseData;
      
      try {
        // Use AbortController for timeout functionality
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
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
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        responseData = await response.json();
      } catch (apiError) {
        console.error('Main API failed, trying fallback:', apiError);
        
        // Try the fallback route
        try {
          const fallbackResponse = await fetch('/api/chat-fallback', {
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
          
          if (!fallbackResponse.ok) {
            throw new Error(`Fallback API failed with status: ${fallbackResponse.status}`);
          }
          
          responseData = await fallbackResponse.json();
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
          
          // Last resort - use a hardcoded response
          responseData = {
            message: "I appreciate your message. Our system is experiencing temporary issues, but your feedback is still valuable. Please continue sharing your thoughts.",
            isComplete: false
          };
        }
      }
      
      // Add a slight delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
      
      // Add bot response to chat
      const botResponse = {
        id: uuidv4(),
        content: responseData.message,
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
      
      // Check if feedback session is complete
      if (responseData.isComplete && onFeedbackComplete) {
        onFeedbackComplete();
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      setError('Sorry, there was a problem sending your message. Please try again.');
      setIsTyping(false);
    }
  };

  // Reset the chat
  const resetChat = () => {
    setConversationId(uuidv4());
    setIsInitializing(true);
    setError(null);
    
    // Simulate API delay for initialization
    setTimeout(() => {
      const greetingMessage = {
        id: uuidv4(),
        content: "Hello! I'm your friendly feedback assistant for this event. Would you like to share your thoughts about your experience today?",
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages([greetingMessage]);
      setIsInitializing(false);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 ${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col h-full`}>
        <div className="p-4 text-white border-b border-gray-700">
          <h3 className="text-lg font-bold">Event Feedback</h3>
          <p className="text-sm text-gray-400">Share your thoughts with us</p>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <button 
            className="w-full flex items-center justify-between rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm"
            onClick={resetChat}
          >
            <span>New Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-gray-400 text-xs uppercase font-semibold mb-2">Previous Chats</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-800 text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Event Feedback</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-800 text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </div>
          <div className="flex items-center space-x-2 text-sm p-2 rounded-md hover:bg-gray-800 text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-800">Event Feedback Assistant</h3>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {isInitializing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500 mb-4"></div>
              <p className="text-gray-500">Initializing chat...</p>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <Message
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                />
              ))}
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-2">
                  <p className="text-sm font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)} 
                    className="text-xs font-medium text-red-700 hover:text-red-900 mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {isTyping && (
                <div className="p-4 max-w-3xl mx-auto">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Input */}
        <div className="p-4 border-t bg-white">
          <ChatInput onSendMessage={processMessage} disabled={isTyping || isInitializing} />
        </div>
      </div>
    </div>
  );
};

export default Chat; 