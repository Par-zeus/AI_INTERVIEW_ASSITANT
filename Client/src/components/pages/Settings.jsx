// src/pages/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [audioInput, setAudioInput] = useState('');

  const handleProfileNameChange = (e) => setProfileName(e.target.value);
  const handleAudioInputChange = (e) => setAudioInput(e.target.value);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-teal-600 mb-6">Settings</h2>
      
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="dark-mode" className="text-gray-700">Dark Mode</label>
          <input
            type="checkbox"
            id="dark-mode"
            className="form-checkbox mt-1"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>

        <div>
          <label className="block text-gray-700">Profile Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your name"
            value={profileName}
            onChange={handleProfileNameChange}
          />
        </div>

        <div>
          <label className="block text-gray-700">Audio Input</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Select Audio Device"
            value={audioInput}
            onChange={handleAudioInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
