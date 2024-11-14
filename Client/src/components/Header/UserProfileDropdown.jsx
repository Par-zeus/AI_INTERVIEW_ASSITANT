// src/components/UserProfileDropdown.jsx
import React, { useState } from 'react';
import { User, Settings, LogOut, ChevronDown, Award } from 'lucide-react';

const UserProfileDropdown = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    onNavigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200"
      >
        <User className="text-blue-500" size={20} />
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <button
            onClick={() => {
              onNavigate('/user-profile');
              setIsOpen(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User size={16} className="mr-2" /> Profile
          </button>
          <button
            onClick={() => {
              onNavigate('/settings');
              setIsOpen(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} className="mr-2" /> Settings
          </button>
          <button
            onClick={() => {
              onNavigate('/progress');
              setIsOpen(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Award size={16} className="mr-2" /> Progress
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
