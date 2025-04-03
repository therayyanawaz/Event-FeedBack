import React from 'react';
import { format } from 'date-fns';

type MessageProps = {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

const Message: React.FC<MessageProps> = ({ content, sender, timestamp }) => {
  const isBot = sender === 'bot';
  
  return (
    <div className={`py-5 ${isBot ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} border-b border-gray-100 dark:border-gray-700 last:border-0`}>
      <div className="max-w-3xl mx-auto flex">
        <div className={`flex-shrink-0 mr-3`}>
          {isBot ? (
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-800 dark:text-gray-200">{content}</div>
          <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {format(timestamp, 'p')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message; 