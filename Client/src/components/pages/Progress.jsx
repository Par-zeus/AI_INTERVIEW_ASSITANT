import React, { useState } from 'react';

import { User, Clock, Briefcase, Star, BarChart, Calendar } from 'lucide-react';
import { progress } from 'framer-motion';

// Progress Component
const Progress = () => {
  // Sample interview history data - in a real app, this would come from your backend
  const interviewHistory = [
    {
      id: 1,
      role: "Frontend Developer",
      date: "2024-03-15",
      duration: "45 min",
      score: 85,
      feedback: "Strong technical skills, could improve behavioral responses"
    },
    {
      id: 2,
      role: "React Developer",
      date: "2024-03-10",
      duration: "30 min",
      score: 78,
      feedback: "Good communication, needs work on system design concepts"
    },
    {
      id: 3,
      role: "Full Stack Developer",
      date: "2024-03-05",
      duration: "60 min",
      score: 92,
      feedback: "Excellent overall performance, great problem-solving skills"
    }
  ];

  const stats = {
    totalInterviews: interviewHistory.length,
    averageScore: Math.round(interviewHistory.reduce((acc, curr) => acc + curr.score, 0) / interviewHistory.length),
    totalDuration: interviewHistory.reduce((acc, curr) => acc + parseInt(curr.duration), 0),
    bestScore: Math.max(...interviewHistory.map(i => i.score))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className=" p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold">{stats.totalInterviews}</p>
            </div>
            <Briefcase className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
            </div>
            <BarChart className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Duration</p>
              <p className="text-2xl font-bold">{stats.totalDuration} min</p>
            </div>
            <Clock className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Best Score</p>
              <p className="text-2xl font-bold">{stats.bestScore}%</p>
            </div>
            <Star className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Interview History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {interviewHistory.map((interview) => (
            <div key={interview.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{interview.role}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  interview.score >= 90 ? 'bg-green-100 text-green-800' :
                  interview.score >= 75 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Score: {interview.score}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-500">
                  <Calendar className="mr-2" size={16} />
                  <span>{new Date(interview.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="mr-2" size={16} />
                  <span>{interview.duration}</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{interview.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Progress