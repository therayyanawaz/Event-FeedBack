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
    <div 
      className={`my-2 flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
          isBot 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-primary-500 text-white'
        }`}
      >
        <div className="text-sm">{content}</div>
        <div 
          className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-primary-200'
          }`}
        >
          {format(timestamp, 'p')}
        </div>
      </div>
    </div>
  );
};

export default Message; 