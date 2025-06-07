import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Play, Clock, Briefcase } from 'lucide-react';

const InterviewItemCard = ({ interview }) => {
  const navigate = useNavigate();

  const onStart = () => {
    navigate(`/interview/${interview._id}`);
  };

  const onFeedbackPress = () => {
    navigate(`/interview/${interview._id}/feedback`);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div 
      className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                hover:border-indigo-600/70 transition-all duration-300
                hover:shadow-lg hover:shadow-indigo-600/10 overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      {/* Decorative Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
      
      <div className="p-6">
        {/* Job Details Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-grow pr-4">
            <h2 className="text-xl font-bold text-indigo-100 mb-2">
              {interview.jobPosition}
            </h2>
            <div className="flex items-center space-x-3 text-indigo-300/80">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="text-sm">{interview.jobExperience} Yrs Experience</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(interview.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-700/50 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-indigo-200">Completed</span>
          </div>
        </div>
        
        {/* Progress Indicator - Optional */}
        {/* <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-indigo-300">Performance Score</span>
            <span className="text-xs font-medium text-indigo-200">85%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div> */}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.button 
            onClick={onFeedbackPress}
            className="px-4 py-3 bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 rounded-xl
                     text-indigo-200 font-medium flex items-center justify-center
                     hover:bg-indigo-800/50 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>View Feedback</span>
          </motion.button>
          
          <motion.button 
            onClick={onStart}
            className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl
                     text-white font-medium flex items-center justify-center
                     hover:from-indigo-600 hover:to-blue-600 transition-all duration-300
                     shadow-lg shadow-indigo-600/30"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="h-4 w-4 mr-2" />
            <span>Start Interview</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewItemCard;