// src/pages/InterviewModeSelection.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const InterviewModeSelection = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const modes = [
    {
      id: 'oral',
      title: 'AI Chat Interview',
      icon: '🤖',
      description: 'Have a natural conversation with our AI interviewer and receive real-time feedback'
    },
    {
      id: 'simple',
      title: 'Question & Answer',
      icon: '📝',
      description: 'Get traditional interview questions and provide written responses'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-teal-800 mb-4">
            Choose Interview Mode
          </h2>
          <p className="text-xl text-gray-600">
            Selected Role: <span className="font-semibold">{role}</span>
          </p>
        </motion.div>

        <div className="space-y-6">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/interview/${mode.id}/${role}`)}
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer
                         hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-6">
                <div className="text-5xl">{mode.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-teal-800 mb-2">
                    {mode.title}
                  </h3>
                  <p className="text-gray-600">{mode.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewModeSelection;