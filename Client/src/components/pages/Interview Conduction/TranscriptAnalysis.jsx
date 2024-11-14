// src/pages/TranscriptAnalysis.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiChartBar, HiLightningBolt } from 'react-icons/hi';

const TranscriptAnalysis = () => {
  const [responses, setResponses] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Load responses from localStorage
    const savedResponses = JSON.parse(localStorage.getItem('interviewResponses') || '[]');
  setResponses(savedResponses);
    // Simulate analysis generation
    setAnalysis({
      overallScore: 85,
      metrics: {
        clarity: 90,
        relevance: 85,
        confidence: 82,
        technicalAccuracy: 88
      },
      feedback: [
        "Strong communication skills demonstrated",
        "Good technical knowledge display",
        "Could improve response conciseness",
        "Excellent problem-solving approach"
      ]
    });
  }, []);

  const handleDownload = () => {
    // Implement PDF generation and download
    console.log('Downloading transcript...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-teal-800">
                Interview Analysis
              </h2>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg
                         hover:bg-teal-700 transition-colors duration-200"
              >
                <HiDownload className="text-xl" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Overall Score */}
            <div className="text-center p-6 bg-teal-50 rounded-lg mb-6">
              <div className="text-5xl font-bold text-teal-800 mb-2">
                {analysis?.overallScore}%
              </div>
              <div className="text-teal-600">Overall Performance</div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analysis?.metrics && Object.entries(analysis.metrics).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-800">{value}%</div>
                  <div className="text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">
              Key Feedback
            </h3>
            <div className="space-y-3">
              {analysis?.feedback.map((feedback, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <HiLightningBolt className="text-teal-600 text-xl flex-shrink-0 mt-1" />
                  <span>{feedback}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Response Transcript */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">
              Response Transcript
            </h3>
            <div className="space-y-6">
            {responses.map((response, index) => (
  <div key={index} className="space-y-2">
    <div className="font-semibold text-teal-800">
      Question {index + 1}
    </div>
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="font-medium mb-2">Q: {response.question}</div>
      <div>A: {response.answer}</div>
    </div>
  </div>
))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TranscriptAnalysis;