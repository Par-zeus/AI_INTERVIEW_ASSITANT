import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { 
  Mic, 
  StopCircle, 
  Camera, 
  X, 
  Save, 
  RefreshCw, 
  VideoOff, 
  Volume2, 
  Clock, 
  CheckCircle2,
  Shield,
  Lightbulb
} from "lucide-react";
import useSpeechToText from "react-hook-speech-to-text";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { chatSession } from "../../../config/GeminiAiModel";
import { toast } from "react-toastify";
import webcamImage from "../../../assets/webcam.png";
import { motion, AnimatePresence } from "framer-motion";

const RecordAnswerSection = ({
  activeQuestionIndex,
  mockInterviewQuestion,
  interviewData,
  setAllCapturedImages,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [capturingInProgress, setCapturingInProgress] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdownTime, setCountdownTime] = useState(null);
  const [confidenceTips, setConfidenceTips] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const captureScreenshot = () => {
    if (webcamRef.current && cameraActive) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => {
        const updated = [...prev, imageSrc];
        setAllCapturedImages((prevImages) => [...prevImages, imageSrc]); // push directly
        return updated;
      });
      
    }
  };

  const saveCurrentScreenshots = () => {
    setAllCapturedImages((prev) => [...prev, ...capturedImages]);
    setCapturingInProgress(false);
  };

  useEffect(() => {
    setCapturedImages([]); // Clear last round
    setCapturingInProgress(true);
    setCountdownTime(30);

    const interval = setInterval(() => {
      captureScreenshot();
      setCountdownTime((prev) => (prev > 0 ? prev - 2 : 0));
    }, 2000); // 15 screenshots in 30 sec

    const timeout = setTimeout(() => {
      clearInterval(interval);
      saveCurrentScreenshots();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setCapturingInProgress(false);
    };
  }, [activeQuestionIndex]);

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results?.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      updateUserAnswer();
    }
  }, [isRecording]);

  const startStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
      toast.info(
        <div className="flex items-center gap-2">
          <Mic className="text-blue-500" size={16} />
          <span>Recording started! Speak clearly...</span>
        </div>,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const updateUserAnswer = async () => {
    try {
      setLoading(true);
      setIsSaving(true);
      
      if (!userAnswer || !interviewData?._id) {
        toast.error("No answer recorded or interview data missing");
        return;
      }

      const questionText = mockInterviewQuestion[activeQuestionIndex]?.question;
      const feedbackPrompt = `Question: ${questionText}, User Answer: ${userAnswer}. Depending on the question and answer, please provide a rating and feedback (3-5 lines) in JSON format with 'rating' and 'feedback' fields.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      const jsonFeedbackResp = JSON.parse(mockJsonResp);
      
      const userAnswerData = {
        mockIdRef: interviewData?._id,
        question: questionText,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userId: interviewData?.user,
      };

      // Send data to backend
      const response = await axiosPrivate.post(
        "/api/interview/user-answer",
        userAnswerData
      );
      
      if (response.status === 201) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={16} />
            <span>Your answer has been saved successfully</span>
          </div>
        );
        setUserAnswer("");
        setResults([]);
      }
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast.error("Failed to record answer");
    } finally {
      setResults([]);
      setLoading(false);
      setIsSaving(false);
    }
  };

  const formatTimeLeft = (seconds) => {
    return `${Math.floor(seconds)}s`;
  };

  // Interview tips
  const tips = [
    "Use the STAR method: Situation, Task, Action, Result",
    "Maintain eye contact with the camera",
    "Speak clearly and at a moderate pace",
    "Highlight specific achievements with metrics",
    "Show enthusiasm for the role and company"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col space-y-5"
    >
      {/* Camera section */}
      <div className="relative w-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-indigo-900/70">
        {/* Recording indicator */}
        {capturingInProgress && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 right-4 z-30 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center space-x-2 border border-red-500/30 shadow-lg shadow-red-500/20"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-md shadow-red-500/50"></div>
            <span className="text-white text-xs font-medium tracking-wide">
              REC {formatTimeLeft(countdownTime)}
            </span>
          </motion.div>
        )}
        
        {/* Webcam or placeholder */}
        <AnimatePresence mode="wait">
          {cameraActive ? (
            <motion.div 
              key="webcam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <Webcam
                ref={webcamRef}
                mirrored
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-[400px] object-cover rounded-xl"
                videoConstraints={{
                  facingMode: "user",
                  width: 1280,
                  height: 720,
                }}
              />
              
              {/* Camera overlay - adds a subtle frame/vignette effect */}
              <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]"></div>
              
              {/* Camera controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 right-4 z-20"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCameraActive(false)}
                  className="bg-slate-800/80 backdrop-blur-md hover:bg-slate-700/80 rounded-full p-2.5 transition-all border border-slate-700/50 shadow-lg"
                >
                  <VideoOff className="w-5 h-5 text-red-400" />
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative bg-gradient-to-b from-slate-800 to-indigo-900 h-[400px] flex items-center justify-center flex-col rounded-xl"
            >
              <div className="w-20 h-20 rounded-full bg-slate-700/50 backdrop-blur-md flex items-center justify-center mb-4 border border-slate-600/30">
                <Camera className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-indigo-200 mb-1 text-lg font-medium">Camera is currently off</p>
              <p className="text-indigo-300/70 text-sm max-w-xs text-center">
                Turn on your camera to enable visual feedback for your interview
              </p>
              
              {/* Camera controls */}
              <div className="absolute bottom-4 right-4 z-20">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCameraActive(true)}
                  className="bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-700/80 rounded-full p-2.5 transition-all border border-indigo-500/50 shadow-lg"
                >
                  <Camera className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Status badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-slate-800/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 shadow-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-200">Question {activeQuestionIndex + 1}</span>
          </div>
          
          {isRecording && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-900/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-700/30 shadow-lg flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-red-200">Recording</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Answer display section */}
      <AnimatePresence>
        {userAnswer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-800/60 backdrop-blur-md rounded-xl p-5 shadow-lg border border-indigo-800/30"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600/50 p-1.5 rounded-md">
                  <Save className="w-4 h-4 text-indigo-300" />
                </div>
                <h3 className="text-indigo-100 font-medium">Your Response</h3>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setUserAnswer("");
                  setResults([]);
                }}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/50 rounded-full"></div>
              <p className="text-indigo-200/90 pl-3 leading-relaxed text-sm max-h-40 overflow-y-auto custom-scrollbar">
                {userAnswer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Recording controls */}
        <div className="lg:col-span-2">
          <motion.div 
            className="flex justify-center lg:justify-start items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  onClick={startStopRecording}
                  className={`
                    px-6 py-3.5 rounded-xl font-medium transition-all duration-300 
                    flex items-center gap-2 shadow-lg shadow-red-600/20
                    bg-gradient-to-r from-red-500 to-red-600 text-white
                    ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl hover:shadow-red-600/30"}
                  `}
                >
                  <StopCircle className="w-5 h-5" />
                  Stop Recording
                </motion.button>
              ) : (
                <motion.button
                  key="record"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading || isSaving}
                  onClick={startStopRecording}
                  className={`
                    px-6 py-3.5 rounded-xl font-medium transition-all duration-300 
                    flex items-center gap-2 shadow-lg shadow-indigo-600/20
                    bg-gradient-to-r from-indigo-500 to-blue-500 text-white
                    ${(loading || isSaving) ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl hover:shadow-blue-600/30"}
                    border border-indigo-500/20
                  `}
                >
                  <Mic className="w-5 h-5" />
                  Record Answer
                </motion.button>
              )}
            </AnimatePresence>

            {userAnswer && !isRecording && !isSaving && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setUserAnswer("");
                  setResults([]);
                }}
                className="
                  px-4 py-3.5 rounded-xl font-medium
                  bg-slate-800/60 text-indigo-300 
                  hover:bg-slate-700/60 hover:text-indigo-200
                  transition-all duration-300 
                  flex items-center gap-2
                  border border-slate-700/50 backdrop-blur-md
                "
              >
                <X className="w-5 h-5" />
                Clear
              </motion.button>
            )}
            
            {isSaving && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-900/40 backdrop-blur-md rounded-xl border border-indigo-800/30 text-indigo-300"
              >
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Quick tips toggle */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <button 
              onClick={() => setConfidenceTips(!confidenceTips)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border 
                transition-all duration-300
                ${confidenceTips 
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-300" 
                  : "bg-slate-800/50 border-slate-700/50 text-indigo-300 hover:bg-slate-700/50"}
              `}
            >
              <Lightbulb className={`w-4 h-4 ${confidenceTips ? "text-amber-400" : "text-indigo-400"}`} />
              Interview Tips
            </button>
          </motion.div>
        </div>
      </div>

      {/* Interview tips */}
      <AnimatePresence>
        {confidenceTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 backdrop-blur-md rounded-xl border border-amber-800/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-amber-400" size={18} />
                <h3 className="text-amber-300 font-medium">Interview Confidence Tips</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((tip, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-2"
                  >
                    <div className="mt-1 min-w-5">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs">
                        ✓
                      </div>
                    </div>
                    <p className="text-amber-200/90 text-sm">{tip}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add custom scroll styles */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </motion.div>
  );
};

export default RecordAnswerSection;