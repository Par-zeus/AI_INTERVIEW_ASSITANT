import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // const isLoggedIn = localStorage.getItem('isLoggedIn'); // Simple auth check
    const isLoggedIn =true;
    if (isLoggedIn) {
      navigate('/user-profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-teal-800 mb-6">
            Master Your Interview Skills with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice interviews, receive real-time feedback, and improve your chances of landing your dream job.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-xl font-semibold 
                     hover:bg-teal-700 transform hover:scale-105 transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <FeatureCard 
              icon="🎯"
              title="Targeted Practice"
              description="Role-specific interview questions and scenarios."
            />
            <FeatureCard 
              icon="🤖"
              title="AI Analysis"
              description="Get instant feedback on your responses and communication style."
            />
            <FeatureCard 
              icon="📊"
              title="Detailed Reports"
              description="Comprehensive analysis of your performance with actionable insights."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-teal-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default LandingPage;