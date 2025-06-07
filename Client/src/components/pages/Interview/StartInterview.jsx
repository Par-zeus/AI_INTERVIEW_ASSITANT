import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Camera, 
  Code, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Info,
  CheckCircle
} from 'lucide-react';
import Webcam from 'react-webcam';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { motion } from 'framer-motion';

const StartInterview = () => {
    const { interviewId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.get(`/api/interview/${interviewId}`);
            setInterviewData(response.data);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 py-16">
                {/* Header Section */}
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
                                Interview Preparation
                            </span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200">
                        Ready for Your Mock Interview
                    </h1>
                    
                    <p className="text-xl text-indigo-100 max-w-3xl">
                        Set up your camera and microphone to begin your personalized interview session.
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Interview Details Section */}
                    <motion.div 
                        className="flex flex-col gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div 
                            className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                                    hover:border-indigo-600/70 transition-all duration-300
                                    hover:shadow-lg hover:shadow-indigo-600/10 p-8"
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                            <h3 className="text-xl font-bold text-indigo-100 mb-6 flex items-center">
                                <Briefcase className="mr-3 text-indigo-400" size={24} />
                                Interview Details
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mr-4">
                                        <Briefcase className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-indigo-300 mb-1">Job Role/Position</p>
                                        <p className="text-lg font-medium text-indigo-100">
                                            {isLoading ? 'Loading...' : interviewData?.jobPosition || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mr-4">
                                        <Code className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-indigo-300 mb-1">Tech Stack</p>
                                        <p className="text-lg font-medium text-indigo-100">
                                            {isLoading ? 'Loading...' : interviewData?.jobDesc || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mr-4">
                                        <Clock className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-indigo-300 mb-1">Experience Level</p>
                                        <p className="text-lg font-medium text-indigo-100">
                                            {isLoading ? 'Loading...' : `${interviewData?.jobExperience} years` || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="bg-indigo-900/30 backdrop-blur-md rounded-2xl border border-indigo-700/50 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex items-start mb-4">
                                <div className="inline-flex items-center justify-center p-2 bg-indigo-800/70 rounded-lg mr-4">
                                    <Info className="h-5 w-5 text-indigo-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-indigo-100 mb-2">Important Information</h3>
                                    <p className="text-indigo-200 leading-relaxed">
                                        Enable your webcam and microphone to start your AI-generated mock interview. 
                                        You'll be presented with 5 tailored questions based on your tech stack.
                                        After completing all questions, you'll receive a comprehensive performance report.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="pl-12 space-y-3">
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />
                                    <span className="text-sm text-indigo-200">5 personalized interview questions</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />
                                    <span className="text-sm text-indigo-200">Real-time performance analysis</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />
                                    <span className="text-sm text-indigo-200">Detailed feedback report</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Webcam Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col items-center justify-center"
                    >
                        {webCamEnabled ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl overflow-hidden border-2 border-indigo-600/30 shadow-lg shadow-indigo-600/20 w-full"
                            >
                                <Webcam
                                    onUserMedia={() => setWebCamEnabled(true)}
                                    onUserMediaError={() => setWebCamEnabled(false)}
                                    mirrored={true}
                                    className="w-full h-auto"
                                    style={{ minHeight: "350px", maxWidth: "100%" }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="flex flex-col items-center justify-center w-full h-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                                              p-12 mb-8 w-full flex flex-col items-center justify-center min-h-72">
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            repeatType: "reverse", 
                                            duration: 2 
                                        }}
                                    >
                                        <Camera className="h-32 w-32 text-indigo-400 mb-6" />
                                    </motion.div>
                                    <p className="text-indigo-200 text-center">
                                        Enable your camera to begin the interview process
                                    </p>
                                </div>
                                
                                <motion.button 
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl
                                             text-white font-medium flex items-center justify-center
                                             hover:from-indigo-600 hover:to-blue-600 transition-all duration-300
                                             shadow-lg shadow-indigo-600/30"
                                    onClick={() => setWebCamEnabled(true)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Camera className="h-5 w-5 mr-2" />
                                    Enable Camera & Microphone
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
                
                {/* Start Interview Button */}
                <motion.div 
                    className="flex justify-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <motion.button 
                        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl
                                 text-white font-medium text-lg flex items-center justify-center
                                 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300
                                 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => navigate(`/interview/${interviewId}/start`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={!webCamEnabled}
                    >
                        Start Your Interview
                        <ArrowRight className="ml-3 h-5 w-5" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default StartInterview;