import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Award, Edit, Shield, HelpCircle, Bell } from 'lucide-react';
import useLogout from '../../hooks/useLogout';

const UserProfileDropdown = ({ onNavigate, user = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const logout = useLogout();

  const { name = 'User', avatar, role = 'Member' } = user;
  const initials = name.substring(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async() => {
    await logout().then(onNavigate('/login'));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-slate-800/60 
                   p-1.5 pr-3 hover:bg-slate-700/60 transition-all duration-300"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-white">{initials}</span>
          )}
        </div>
        <span className="text-sm font-medium text-white hidden sm:block">{name}</span>
        <ChevronDown size={16} className={`text-indigo-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl border border-indigo-500/30 shadow-xl 
                      shadow-indigo-900/20 backdrop-blur-lg overflow-hidden z-50 transform origin-top-right animate-dropdown">
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 
                            flex items-center justify-center shadow-md">
                <span className="text-white font-medium">{initials}</span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{name}</p>
                <p className="text-xs text-indigo-300">{role}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                onNavigate('/complete-profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-indigo-100 hover:bg-indigo-700/30 transition-colors"
            >
              <User size={16} className="mr-3 text-indigo-400" /> 
              <span>My Profile</span>
            </button>
            
            <button
              onClick={() => {
                onNavigate('/settings');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-indigo-100 hover:bg-indigo-700/30 transition-colors"
            >
              <Settings size={16} className="mr-3 text-indigo-400" /> 
              <span>Account Settings</span>
            </button>
            
            <button
              onClick={() => {
                onNavigate('/notifications');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-indigo-100 hover:bg-indigo-700/30 transition-colors"
            >
              <Bell size={16} className="mr-3 text-indigo-400" /> 
              <span>Notifications</span>
              <span className="ml-auto bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">3</span>
            </button>
            
            <button
              onClick={() => {
                onNavigate('/progress');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-indigo-100 hover:bg-indigo-700/30 transition-colors"
            >
              <Award size={16} className="mr-3 text-indigo-400" /> 
              <span>My Progress</span>
            </button>
            
            <div className="border-t border-slate-700 my-1"></div>
            
            <button
              onClick={() => {
                onNavigate('/help');
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-indigo-100 hover:bg-indigo-700/30 transition-colors"
            >
              <HelpCircle size={16} className="mr-3 text-indigo-400" /> 
              <span>Help & Support</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-red-300 hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} className="mr-3" /> 
              <span>Sign Out</span>
            </button>
          </div>

          <style jsx>{`
            @keyframes dropdown {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-dropdown {
              animation: dropdown 0.2s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;