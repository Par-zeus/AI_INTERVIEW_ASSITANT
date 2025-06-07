import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Home, 
  BookOpen, 
  TrendingUp, 
  ChevronDown,
  Shield,
  Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [scrolled, setScrolled] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define navigation links based on auth status and role
  const getNavLinks = () => {
    if (!auth.isAuthenticated) {
      return [
        { path: '/commonDashboard', label: 'Dashboard', icon: <Home size={18} /> }
      ];
    }

    if (auth.roles === "Interviewer") {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
        { path: '/ScheduleInterview', label: 'Schedule', icon: <Calendar size={18} /> },
        { path: '/InterviewOverview', label: 'Status', icon: <TrendingUp size={18} /> },
      ];
    }

    if (auth.roles === "Interviewee") {
      return [
        { path: '/', label: 'Home', icon: <Home size={18} /> },
        { path: '/complete-profile', label: 'Profile', icon: <User size={18} /> },
        { path: '/dashboard1', label: 'Practice', icon: <BookOpen size={18} /> },
        { path: '/interview', label: 'Progress', icon: <TrendingUp size={18} /> },
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/90 backdrop-blur-lg shadow-lg shadow-indigo-900/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center
                          transform group-hover:scale-105 transition-all duration-300 shadow-md shadow-indigo-500/30">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors">
              Interview AI
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300 ${
                    currentPath === link.path
                      ? 'bg-indigo-600/80 text-white shadow-md shadow-indigo-600/20'
                      : 'hover:bg-slate-800/80 text-indigo-100 hover:text-white'
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
                  className="p-2 text-indigo-200 hover:bg-slate-800/80 hover:text-white rounded-full transition-colors"
                >
                  <Settings size={18} />
                </button>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 
                                flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <span className="text-sm font-medium text-white">
                      {auth.name?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white">{auth.userName || 'User'}</span>
                  <button
                    onClick={() => handleNavigation('/logout')}
                    className="p-2 text-red-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleNavigation('/register')}
                  className="text-indigo-200 hover:text-white px-4 py-2 rounded-lg
                          transition-colors duration-300 font-medium border border-indigo-500/30 hover:border-indigo-500/70"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg
                          transition-all duration-300 font-medium shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-slate-800/70 rounded-lg transition-colors text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={`flex items-center space-x-3 px-6 py-4 w-full transition-colors ${
                currentPath === link.path
                  ? 'bg-indigo-900/50 text-indigo-200'
                  : 'text-white hover:bg-slate-700/50'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
          <div className="border-t border-slate-700">
            {auth.isAuthenticated ? (
              <>
                <div className="flex items-center px-6 py-4 space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 
                                flex items-center justify-center shadow-md">
                    <span className="text-sm font-medium text-white">
                      {auth.name?.substring(0, 2).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{auth.userName || 'User'}</p>
                    <p className="text-indigo-300 text-sm">{auth.roles}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="flex items-center space-x-3 px-6 py-4 text-white hover:bg-slate-700/50 w-full transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => handleNavigation('/logout')}
                  className="flex items-center space-x-3 px-6 py-4 text-red-300 hover:bg-slate-700/50 w-full transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="p-6 flex flex-col space-y-3">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-lg
                            transition-colors duration-300 font-medium shadow-md shadow-indigo-500/20 flex items-center justify-center"
                >
                  <User size={18} className="mr-2" />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="border border-indigo-500/50 text-indigo-200 py-3 rounded-lg
                            hover:border-indigo-400 transition-colors duration-300 font-medium flex items-center justify-center"
                >
                  <Shield size={18} className="mr-2" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;