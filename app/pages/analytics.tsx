'use client';

import React, { useState } from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

export default function AnalyticsPage() {
  const [selectedEvent, setSelectedEvent] = useState('demo-event-123');
  
  // Sample events - In a real app, these would come from your API
  const events = [
    { id: 'demo-event-123', name: 'Tech Conference 2023' },
    { id: 'event-456', name: 'Product Launch' },
    { id: 'event-789', name: 'Annual Workshop' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Event Selector */}
          <div className="px-4 py-4 sm:px-0 mb-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
              <div className="flex items-center">
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mr-4">
                  Select Event:
                </label>
                <select
                  id="event-select"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="px-4 sm:px-0">
            <AnalyticsDashboard eventId={selectedEvent} />
          </div>

          {/* Export Options */}
          <div className="px-4 py-4 sm:px-0 mt-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Export Options</h3>
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Export as PDF
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Export as CSV
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Share Report
                </button>
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