import React from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  Sparkles,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-indigo-900/30">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand/Logo Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center
                            shadow-md shadow-indigo-500/30">
                <Sparkles className="text-white" size={16} />
              </div>
              <span className="text-xl font-semibold text-white">Interview AI</span>
            </div>
            <p className="text-indigo-200/70 mb-6">
              Elevate your interview skills with AI-powered coaching and personalized feedback.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-indigo-100">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Features', 'Pricing', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors flex items-center group">
                    <ChevronRight size={14} className="mr-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-indigo-100">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Help Center', 'Documentation', 'API', 'Status'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-indigo-300 hover:text-indigo-100 transition-colors flex items-center group">
                    <ChevronRight size={14} className="mr-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-indigo-100">Stay Updated</h3>
            <p className="text-indigo-200/70 mb-4">
              Subscribe to our newsletter for the latest features and updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-l-lg px-4 py-2 
                           w-full text-white focus:outline-none"
              />
              <button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600
                                text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-indigo-300/70 mb-4 md:mb-0">
            <span>© 2025 Interview AI Assistant. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="#" className="text-indigo-300/70 hover:text-indigo-100 text-sm transition-colors mb-2 md:mb-0">
              Privacy Policy
            </a>
            <a href="#" className="text-indigo-300/70 hover:text-indigo-100 text-sm transition-colors mb-2 md:mb-0">
              Terms of Service
            </a>
            <a href="#" className="text-indigo-300/70 hover:text-indigo-100 text-sm transition-colors mb-2 md:mb-0">
              Cookie Policy
            </a>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="p-2 bg-indigo-800/50 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <ArrowUp size={18} className="text-indigo-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;