import React, { useState, useEffect, useMemo } from 'react';
import useAuth from '../../../hooks/useAuth';
import { toast } from "react-toastify";
import InterviewItemCard from './InterviewItemCard';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, LoaderCircle, Clock, Award, Target, Search } from 'lucide-react';

const InterviewList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
      const fetchInterviews = async () => {        
        try {
          setIsLoading(true);
          const response = await axiosPrivate.get(`/api/interview/get-interviews/${auth?._id}`);
          setInterviewList(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch interviews', error);
          setIsLoading(false);
          toast.error('Failed to load interviews');
        }
      };
  
      if (auth?._id) {
        fetchInterviews();
      }
    }, [auth, axiosPrivate]);
    
    // Filter interviews based on search term
    const filteredInterviews = useMemo(() => {
      if (!searchTerm.trim()) return interviewList;
      
      return interviewList.filter(interview => 
        interview.jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [interviewList, searchTerm]);
  
    // Memoized calculations for interview statistics
    const interviewStats = useMemo(() => {
      if (interviewList.length === 0) return null;
      
      const totalInterviews = interviewList.length;
      const completedInterviews = interviewList.filter(interview => interview.isCompleted).length;
      const averageExperience = (
        interviewList.reduce((sum, interview) => sum + interview.jobExperience, 0) / totalInterviews
      ).toFixed(1);

      return { 
        totalInterviews, 
        completedInterviews, 
        averageExperience,
        completionRate: Math.round((completedInterviews / totalInterviews) * 100)
      };
    }, [interviewList]);
  
    if (isLoading) {
      return (
        <div className="min-h-96 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoaderCircle className="w-12 h-12 text-indigo-400 animate-spin" />
            <p className="mt-4 text-indigo-200 font-medium">Loading your interviews...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="py-10">
        {/* Stats Cards Section */}
        {interviewStats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                        hover:border-indigo-600/70 transition-all duration-300
                        hover:shadow-lg hover:shadow-indigo-600/10 p-6"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-4">
                <BarChart2 className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-100 mb-1">{interviewStats.totalInterviews}</h3>
              <p className="text-indigo-300 text-sm">Total Interviews</p>
            </motion.div>

            <motion.div 
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                        hover:border-indigo-600/70 transition-all duration-300
                        hover:shadow-lg hover:shadow-indigo-600/10 p-6"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-4">
                <Award className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-100 mb-1">{interviewStats.completionRate}%</h3>
              <p className="text-indigo-300 text-sm">Completion Rate</p>
            </motion.div>

            <motion.div 
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                        hover:border-indigo-600/70 transition-all duration-300
                        hover:shadow-lg hover:shadow-indigo-600/10 p-6"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-4">
                <Target className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-100 mb-1">{interviewStats.averageExperience}</h3>
              <p className="text-indigo-300 text-sm">Avg. Experience Level</p>
            </motion.div>

            <motion.div 
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                        hover:border-indigo-600/70 transition-all duration-300
                        hover:shadow-lg hover:shadow-indigo-600/10 p-6"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-4">
                <Clock className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-indigo-100 mb-1">24.5</h3>
              <p className="text-indigo-300 text-sm">Avg. Duration (min)</p>
            </motion.div>
          </motion.div>
        )}

        {/* Search and Title Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200 mb-4 md:mb-0">
            Your Interview History
          </h2>
          
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="Search interviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/60 backdrop-blur-md border border-indigo-800/40
                         rounded-xl text-indigo-100 placeholder-indigo-400 w-full md:w-64
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Interview List */}
        {filteredInterviews.length === 0 ? (
          <motion.div 
            className="text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40 p-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart2 className="h-24 w-24 mx-auto text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold text-indigo-100 mb-4">
              No Interviews Found
            </h3>
            <p className="text-indigo-300 mb-8">
              {searchTerm ? "No interviews match your search criteria" : "Start your first mock interview to begin your preparation journey"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl 
                        text-white font-medium hover:from-indigo-600 hover:to-blue-600 
                        transition-all duration-300 shadow-lg shadow-indigo-600/30"
            >
              Create Your First Interview
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredInterviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <InterviewItemCard interview={interview} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    );
};

export default InterviewList;