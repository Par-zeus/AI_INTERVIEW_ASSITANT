// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import UserProfileDropdown from './UserProfileDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // const isLoggedIn = localStorage.getItem('isLoggedIn');
  const isLoggedIn =true ;
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(isLoggedIn
      ? [
          { to: '/interview', label: 'Interview' },
          { to: '/transcript', label: 'Transcript' },
          { to: '/progress', label: 'Progress' },
          // { to: '/settings', label: 'Settings' },
        ]
      : [
          { to: '/login', label: 'Login' },
          { to: '/signup', label: 'Sign Up' },
        ]),
  ];

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Interview Assistant</h1>
        <nav className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <RouterLink key={link.to} to={link.to} className="hover:underline">
              {link.label}
            </RouterLink>
          ))}
          {isLoggedIn && <UserProfileDropdown onNavigate={navigate} />}
        </nav>
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-700 p-4">
          {navLinks.map((link) => (
            <RouterLink
              key={link.to}
              to={link.to}
              className="block py-2 hover:underline"
            >
              {link.label}
            </RouterLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
