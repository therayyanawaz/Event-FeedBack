'use client';

import { useState } from 'react';
import Link from 'next/link';
import Chat from './components/Chat';

export default function Home() {
  const [eventId, setEventId] = useState('demo-event-123');
  const [showChat, setShowChat] = useState(true);
  const [feedbackComplete, setFeedbackComplete] = useState(false);

  const handleFeedbackComplete = () => {
    setFeedbackComplete(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header info */}
      <div className="bg-emerald-600 text-white px-4 py-2 text-center text-sm">
        Made with ❤️ by <a href="https://www.linkedin.com/in/therayyanawaz/" target="_blank" rel="noopener noreferrer" className="underline">Md Rayyan Nawaz</a>
      </div>

      {/* Chat interface */}
      {!feedbackComplete ? (
        <div className="flex-1 h-full">
          <Chat eventId={eventId} onFeedbackComplete={handleFeedbackComplete} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 bg-white">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
            <div className="h-16 w-16 mx-auto text-emerald-500 mb-4">
              <svg 
                className="h-full w-full" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Thank You!</h3>
            <p className="mt-2 text-center text-gray-600">
              Your feedback has been successfully submitted and will help improve future events.
            </p>
            <button
              onClick={() => {
                setShowChat(true);
                setFeedbackComplete(false);
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Start New Chat
            </button>
            <Link
              href="/pages/analytics"
              className="mt-4 block text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              View Analytics Dashboard →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 