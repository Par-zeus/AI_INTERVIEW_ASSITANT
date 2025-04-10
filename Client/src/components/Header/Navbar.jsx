import React, { useState } from 'react';
import { Menu, X, User, Calendar, Users, Settings, LogOut, Home, BookOpen, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const {auth}=useAuth();
  // Define navigation links based on auth status and role
  const getNavLinks = () => {
    if (!auth.isAuthenticated) {
      return [
        { path: '/commonDashboard', label: 'Dashboard', icon: <Home size={18} /> }
      ];
    }

    if (auth.roles == "Interviewer") {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: <User size={18} /> },
        { path: '/ScheduleInterview', label: 'Schedule Interview', icon: <Calendar size={18} /> },
        { path: '/InterviewOverview', label: 'Interview Status', icon: <Users size={18} /> },
      ];
    }

    if (auth.roles == "Interviewee") {
      return [
        { path: '/', label: 'Dashboard', icon: <Home size={18} /> },
        { path: '/dashboard1', label: 'Practice Interviews', icon: <BookOpen size={18} /> },
        { path: '/transcript', label: 'Progress Check', icon: <TrendingUp size={18} /> },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  const handleNavigation = (path) => {
    navigate(path);
    setCurrentPath(path);
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center
                          transform group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-semibold group-hover:text-teal-400 transition-colors">Interview Assistant</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 ${
                    currentPath === link.path
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-gray-700 hover:text-teal-400'
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Settings size={20} />
                </button>
                <div className="h-6 w-px bg-gray-600"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 
                                flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {auth.name?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{auth.userName || 'User'}</span>
                  <button
                    onClick={() => handleNavigation('/logout')}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg
                          transition-colors duration-300 font-medium"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-gray-700 w-full transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
          <div className="border-t border-gray-700">
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-gray-700 w-full transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => handleNavigation('/logout')}
                  className="flex items-center space-x-2 px-4 py-3 text-red-400 hover:bg-gray-700 w-full transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="flex items-center space-x-2 px-4 py-3 text-teal-400 hover:bg-gray-700 w-full transition-colors"
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;