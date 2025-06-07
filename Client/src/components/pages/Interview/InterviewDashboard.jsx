import React from 'react';
import { motion } from 'framer-motion';
import AddNewInterview from './AddNewInterview';
import InterviewList from './InterviewList';
import { useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const InterviewDashboard = () => {
  const { role } = useParams();
  
  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="inline-block mb-6 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md">
            <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">
                Interview Preparation Dashboard
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200">
            Your Interview Journey
          </h1>
          
          <p className="text-xl text-indigo-100 max-w-3xl">
            Create personalized AI interview sessions and track your progress to career success.
          </p>
        </motion.div>
        
        <AddNewInterview role={role} />
        <InterviewList />
      </div>
    </motion.div>
  );
};

export default InterviewDashboard;