import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  Bot, 
  BarChart, 
  CheckCircle, 
  Star, 
  TrendingUp 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isLoggedIn = true; // Replace with actual auth check
    navigate(isLoggedIn ? '/dashboard1' : '/login');
  };

  const features = [
    {
      icon: <Target className="text-teal-600" size={48} />,
      title: "Personalized Preparation",
      description: "Tailored interview practice based on your unique skills and career goals."
    },
    {
      icon: <Bot className="text-teal-600" size={48} />,
      title: "AI-Powered Insights",
      description: "Intelligent analysis of your interview performance with actionable feedback."
    },
    {
      icon: <BarChart className="text-teal-600" size={48} />,
      title: "Comprehensive Analytics",
      description: "Detailed reports tracking your progress and improvement areas."
    }
  ];

  const additionalFeatures = [
    { 
      icon: <CheckCircle className="text-emerald-500" size={32} />, 
      title: "Skill Validation" 
    },
    { 
      icon: <Star className="text-yellow-500" size={32} />, 
      title: "Expert Evaluation" 
    },
    { 
      icon: <TrendingUp className="text-blue-500" size={32} />, 
      title: "Career Growth" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-teal-800 mb-6 leading-tight">
            AI-Powered Interview Mastery
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Elevate your interview skills with personalized AI coaching. 
            Practice, learn, and confidently showcase your potential.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-teal-600 text-white px-10 py-4 rounded-full text-xl font-semibold
                       hover:bg-teal-700 transition-all duration-300 
                       shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </motion.button>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 
                           hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-teal-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-16 bg-teal-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">
              Why Choose AI Interview Assistant?
            </h2>
            <div className="flex justify-center space-x-8">
              {additionalFeatures.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <p className="text-gray-700 font-semibold">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;