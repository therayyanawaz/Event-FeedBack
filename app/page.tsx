'use client';

import { useState } from 'react';
import Chat from './components/Chat';

export default function Home() {
  const [eventId, setEventId] = useState('demo-event-123');
  const [showChat, setShowChat] = useState(false);
  const [feedbackComplete, setFeedbackComplete] = useState(false);

  const handleFeedbackComplete = () => {
    setFeedbackComplete(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Event Feedback Chatbot</h1>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Welcome to the Event Feedback Demo</h2>
                <p className="mt-2 text-gray-600">
                  This interactive chatbot makes collecting event feedback easy and engaging. Experience a
                  conversation-based approach that feels natural and increases response rates.
                </p>
                
                {!showChat && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowChat(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Start Feedback Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat window */}
          {showChat && (
            <div className="px-4 sm:px-0">
              <div className="bg-white overflow-hidden shadow rounded-lg h-[500px]">
                {!feedbackComplete ? (
                  <div className="h-full">
                    <Chat eventId={eventId} onFeedbackComplete={handleFeedbackComplete} />
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center h-full">
                    <svg 
                      className="h-16 w-16 text-green-500 mb-4" 
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
                    <h3 className="text-xl font-medium text-gray-900">Thank You!</h3>
                    <p className="mt-2 text-center text-gray-600">
                      Your feedback has been successfully submitted and will help improve future events.
                    </p>
                    <button
                      onClick={() => {
                        setShowChat(false);
                        setFeedbackComplete(false);
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Return to Home
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features section */}
          <div className="px-4 py-8 sm:px-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Interactive Conversations</h3>
                  <p className="mt-2 text-gray-600">
                    Engage attendees with natural dialogue for a better user experience.
                  </p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Real-Time Feedback</h3>
                  <p className="mt-2 text-gray-600">
                    Gather insights during events to enable immediate adjustments.
                  </p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Adaptive Questioning</h3>
                  <p className="mt-2 text-gray-600">
                    Customize follow-up questions based on previous responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Event Feedback Chatbot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 