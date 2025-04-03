import React, { useState, useEffect } from 'react';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Define settings structure
type AppSettings = {
  darkMode: boolean;
  soundEnabled: boolean;
  language: string;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    soundEnabled: true,
    language: 'en'
  });

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedSettings = localStorage.getItem('eventFeedbackSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('eventFeedbackSettings', JSON.stringify(settings));
    
    // Apply dark mode if enabled
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Update a specific setting
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all conversation data
  const clearConversationHistory = () => {
    // Clear localStorage items related to conversations
    const keysToKeep = ['eventFeedbackSettings']; // We want to keep settings
    
    Object.keys(localStorage).forEach(key => {
      if (!keysToKeep.includes(key) && key.startsWith('eventFeedback')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reload the page to clear any in-memory conversations
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.darkMode}
                  onChange={e => updateSetting('darkMode', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Sound</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.soundEnabled}
                  onChange={e => updateSetting('soundEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Language</h3>
            <select 
              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={settings.language}
              onChange={e => updateSetting('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Clear Data</h3>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={clearConversationHistory}
            >
              Clear Conversation History
            </button>
            <p className="text-xs text-gray-500 mt-1">
              This will remove all your previous conversations.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
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

export default SettingsModal; 