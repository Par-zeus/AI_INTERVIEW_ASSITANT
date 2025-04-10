import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video,
  Mic,
  Cpu
} from 'lucide-react';

const InterviewModeSelection = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const modes = [
    {
      id: 'video',
      title: 'Video Interview',
      icon: <Video className="text-teal-600" size={48} />,
      description: 'Record video responses to simulate real interview scenarios',
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      id: 'ai-oral',
      title: 'Audio Interview',
      icon: <Mic className="text-teal-600" size={48} />,
      description: 'Audio-based interview to assess verbal communication skills',
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-2 rounded-full">
              Get Started
            </span>
          </div>
          <h2 className="text-5xl font-bold text-teal-800 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
            Interview Preparation Mode
          </h2>
          <p className="text-2xl text-gray-600 relative inline-block">
            Role: 
            <span className="font-semibold text-teal-700 ml-2 relative">
              {role}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 to-cyan-300 transform scale-x-100"></div>
            </span>
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => navigate(`/interview/${role}/${mode.id}`)}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 cursor-pointer
                         transform hover:scale-105 transition-all duration-500 ease-in-out
                         border border-transparent hover:border-teal-100 group
                         overflow-hidden"
            >
              {/* Gradient Background Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500
                              bg-gradient-to-br ${mode.gradient}`}></div>
              
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300
                              p-4 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
                  {mode.icon}
                </div>
                <h3 className="text-2xl font-bold text-teal-800 mb-3">
                  {mode.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {mode.description}
                </p>
                <span className="inline-flex items-center text-teal-600 font-semibold mt-4 px-6 py-2
                                group-hover:text-teal-700 transition-all duration-300
                                rounded-full bg-teal-50 group-hover:bg-teal-100">
                  Start Interview
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-6">
          <div className="inline-flex items-center bg-gradient-to-r from-teal-100 to-cyan-100 
                          rounded-full px-8 py-4 shadow-md hover:shadow-lg transition-all duration-300
                          border border-teal-200/30">
            <Cpu className="mr-4 text-teal-700" size={24} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700 font-semibold text-lg">
              AI-Powered Interview Preparation
            </span>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm max-w-md mx-auto"
          >
            Choose your preferred interview mode to begin your preparation journey
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default InterviewModeSelection;