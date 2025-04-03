import React from 'react';

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Help Center</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">About Event Feedback Assistant</h3>
            <p className="text-gray-600 mb-4">
              The Event Feedback Assistant is designed to help collect valuable feedback about events in a 
              conversational manner. It provides a more engaging way for attendees to share their thoughts 
              and experiences.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Simply start typing in the message box to begin a conversation.</li>
              <li>The assistant will guide you through a series of questions about the event.</li>
              <li>You can rate different aspects of the event on a scale of 1-5.</li>
              <li>For text questions, provide as much detail as you'd like.</li>
              <li>You can press Enter to send your message (Shift+Enter for a new line).</li>
            </ol>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Frequently Asked Questions</h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">Is my feedback anonymous?</h4>
              <p className="text-gray-600">
                Yes, your personal information is not collected unless you explicitly provide it.
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">Can I edit my responses?</h4>
              <p className="text-gray-600">
                Once a response is submitted, it cannot be edited. However, you can provide additional 
                context or corrections in subsequent messages.
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">What happens to my feedback?</h4>
              <p className="text-gray-600">
                Your feedback is collected and analyzed to help improve future events. It provides 
                valuable insights to organizers about what worked well and what could be improved.
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">Can I start over?</h4>
              <p className="text-gray-600">
                Yes, you can start a new conversation by clicking the "New Chat" button in the sidebar.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Support</h3>
            <p className="text-gray-600 mb-2">
              If you're experiencing any issues or have questions not covered here, please contact our support team:
            </p>
            <a href="mailto:support@eventfeedback.com" className="text-emerald-600 hover:text-emerald-700">
              support@eventfeedback.com
            </a>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t sticky bottom-0 bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 