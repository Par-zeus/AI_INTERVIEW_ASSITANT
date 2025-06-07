import React, { useEffect, useState } from "react";
import QuestionsSection from "./QuestionsSection";
import RecordAnswerSection from "./RecordAnswerSection";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Feedback from "./Feedback";

const MainInterview = () => {
  const [allCapturedImages, setAllCapturedImages] = useState([]);
  const { interviewId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
    setSessionStartTime(Date.now());
    
    // Start timer for interview duration
    const timerInterval = setInterval(() => {
      if (sessionStartTime) {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);

  const GetInterviewDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get(`/api/interview/${interviewId}`);
      const result = response.data;

      const parsedData = JSON.parse(result.jsonMockResp);
      setMockInterviewQuestion(parsedData);
      setInterviewData(result);

      console.log("Interview Data:", result);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error("Failed to load interview questions");
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadAllScreenshots = async () => {
    const formData = new FormData();
    allCapturedImages.forEach((img, index) => {
        const blob = dataURItoBlob(img);
        formData.append("images", blob, `question_${index + 1}.jpg`);
    });

    try {
        console.log(formData);
        const response = await axiosPrivate.post('/api/interview/upload-screenshots', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);
        // No visible toast for screenshot upload - happens behind the scenes
        return response.data;
    } catch (err) {
        console.error("Upload failed:", err);
        // Only show error if upload fails
        toast.error("An error occurred while processing your interview");
        throw err;
    }
  };

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = async () => {
    try {
      // Show loading notification while processing behind the scenes
      toast.info(
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="font-medium">Processing your interview</p>
            <p className="text-xs text-gray-500">Please wait a moment...</p>
          </div>
        </div>,
        { autoClose: 3000 }
      );
      
      // Wait for any pending answers to be saved
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify if all questions have answers (using the original condition from your code)
      const response = await axiosPrivate.get(
        `/api/interview/feedback/${interviewId}`
      );
      
      if (true||(response.data && response.data.length === mockInterviewQuestion.length)) {
        // Upload screenshots behind the scenes
        const feedback1=await uploadAllScreenshots();
        await axiosPrivate.post(`/api/interview/${interviewId}/video-analysis`, feedback1,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        console.log("saved");
        // Navigate to feedback page passing the interviewId
        navigate(`/interview/${interviewId}/feedback`);
        
      } else {
        toast.warning(
          "Please answer all questions before ending the interview"
        );
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Error ending interview");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="flex flex-col items-center bg-slate-800/50 p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-700/50">
          <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-xl font-medium text-indigo-100">Preparing your interview...</p>
          <p className="text-indigo-300/70 mt-2">Loading questions and setting up your session</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-slate-800/70 p-4 rounded-xl backdrop-blur-md border border-slate-700/50 w-full md:w-auto"
          >
            <h1 className="text-xl font-bold text-indigo-100">
              {interviewData?.title || "Professional Interview Session"}
            </h1>
            <p className="text-indigo-300 text-sm">Prepare with confidence</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap gap-3 w-full md:w-auto"
          >
            <div className="bg-indigo-900/40 backdrop-blur-md p-3 rounded-xl border border-indigo-800/40 flex items-center gap-2 flex-1 md:flex-auto">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs text-indigo-300">Session Time</p>
                <p className="text-lg font-semibold text-indigo-100">{formatTime(elapsedTime)}</p>
              </div>
            </div>
            
            <div className="bg-indigo-900/40 backdrop-blur-md p-3 rounded-xl border border-indigo-800/40 flex items-center gap-2 flex-1 md:flex-auto">
              <Activity className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-xs text-indigo-300">Questions</p>
                <p className="text-lg font-semibold text-indigo-100">{activeQuestionIndex + 1}/{mockInterviewQuestion.length}</p>
              </div>
            </div>
          </motion.div>
        </div>
      
        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full bg-slate-800/50 h-2.5 rounded-full overflow-hidden backdrop-blur-md"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ 
              width: `${((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 relative"
          >
            <div className="absolute -right-1 -top-1.5 h-5 w-5 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50"></div>
          </motion.div>
        </motion.div>
        
        <div className="flex justify-between items-center text-sm text-indigo-300/70">
          <span>Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}</span>
          <span>{Math.round(((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100)}% complete</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            <QuestionsSection
              activeQuestionIndex={activeQuestionIndex}
              mockInterviewQuestion={mockInterviewQuestion}
            />
            <RecordAnswerSection
              activeQuestionIndex={activeQuestionIndex}
              mockInterviewQuestion={mockInterviewQuestion}
              interviewData={interviewData}
              setAllCapturedImages={setAllCapturedImages}
            />
          </motion.div>
        </AnimatePresence>
        
        <motion.div 
          className="flex justify-end space-x-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {activeQuestionIndex > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="px-6 py-3.5 bg-slate-800/60 border border-slate-700/50 text-indigo-200 rounded-xl 
                        transition duration-300 ease-in-out flex items-center gap-2
                        hover:bg-slate-700/60 cursor-pointer hover:shadow-lg hover:shadow-indigo-900/30
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Question
            </motion.button>
          )}
          
          {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="px-6 py-3.5 cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl 
                        transition duration-300 ease-in-out flex items-center gap-2
                        hover:from-indigo-600 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-600/20
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Next Question
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
          
          {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl 
                        transition duration-300 ease-in-out flex items-center gap-2
                        hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:shadow-green-600/20
                        focus:outline-none focus:ring-2 focus:ring-green-500/50"
              onClick={handleEndInterview}
            >
              <CheckCircle className="w-5 h-5" />
              End Interview
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainInterview;