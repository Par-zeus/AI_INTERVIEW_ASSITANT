import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, ArrowRight, Loader2, Timer, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../../../services/interviewService';
import useAuth from '../../../hooks/useAuth';


const VideoInterview = () => {
  const { role } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about yourself and your background in this field."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);


  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

    // Add new state for recording timer
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef(null);

    const videoStyle = {
      transform: 'rotateY(180deg)',
      WebkitTransform: 'rotateY(180deg)', // For Safari support
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    };
  
    useEffect(() => {
      if (isRecording) {
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        clearInterval(timerRef.current);
        setRecordingTime(0);
      }
      return () => clearInterval(timerRef.current);
    }, [isRecording]);
  
    // Format recording time to MM:SS
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
  const getNextQuestion = async (lastAnswer) => {
    try {
      setIsLoading(true);
      const response = await interviewService.getNextQuestion(lastAnswer, role, conversationHistory);
      return response;
    } catch (error) {
      console.error('Error getting next question:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.style.transform = 'rotateY(180deg)'; // Mirror live preview
      streamRef.current = stream;

      // Create MediaRecorder without mirroring for the actual recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      setError('Failed to start recording. Please check your camera and microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleNextQuestion = async () => {
    try {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      
      const newHistory = [
        ...conversationHistory,
        { 
          question: currentQuestion, 
          answer: videoUrl // Store video URL instead of transcript
        },
      ];
      setConversationHistory(newHistory);
      
      if (currentQuestionIndex === 4) {
        await saveRecordings(newHistory);
        setIsInterviewComplete(true);
        navigate("/transcript");
        return;
      }

      let nextQuestion;
      if (currentQuestionIndex === 0) {
        nextQuestion = {
          questionText: "What are your strengths and weaknesses?"
        };
      } else if (currentQuestionIndex === 1) {
        nextQuestion = {
          questionText: "Where do you see yourself in 5 years?"
        };
      } else {
        const response = await getNextQuestion("Video response provided");
        nextQuestion = response;
      }

      if (!nextQuestion || !nextQuestion.questionText) {
        throw new Error("No valid question received");
      }

      setCurrentQuestion(nextQuestion.questionText);
      setRecordedChunks([]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching next question:", err);
      setError("Failed to proceed to the next question. Please try again.");
    }
  };

  const saveRecordings = async (conversationData) => {
    try {
      const formData = new FormData();
      conversationData.forEach((item, index) => {
        formData.append(`video_${index}`, new Blob([item.answer], { type: 'video/webm' }));
      });
      formData.append('email', auth.email);
      formData.append('role', role);
      
      const response = await interviewService.saveVideoRecordings(formData);
      return response;
    } catch (error) {
      console.error('Error saving recordings:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">Error Occurred</h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
                     transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-teal-700 text-white p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                {role} Video Interview
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="h-2 bg-teal-900/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <span className="text-lg font-medium">
                  Question {currentQuestionIndex + 1}/5
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-8">
            {/* Current Question Card */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-6 mb-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {currentQuestion}
              </h3>
            </motion.div>

            {/* Video Recording Section */}
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900 aspect-video">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  style={videoStyle}
                />
                
                {/* Recording Indicator */}
                {isRecording && (
          <div className="absolute top-4 left-4 bg-black/70 rounded-full px-4 py-2 
                       flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

              {/* Recording Controls */}
              <div className="flex justify-center mt-6 space-x-4">
                {!isRecording ? (
                  <button 
                    onClick={startRecording}
                    disabled={isLoading}
                    className="px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 
                             transition-all duration-300 transform hover:scale-105
                             disabled:bg-gray-400 disabled:cursor-not-allowed
                             flex items-center space-x-3 shadow-lg"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-lg font-medium">Start Recording</span>
                  </button>
                ) : (
                  <button 
                    onClick={stopRecording}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 
                             transition-all duration-300 transform hover:scale-105
                             flex items-center space-x-3 shadow-lg"
                  >
                    <StopCircle className="w-6 h-6" />
                    <span className="text-lg font-medium">Stop Recording</span>
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center border-t pt-6">
              <button
                onClick={() => navigate('/interview/mode/' + role)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                         transition-all duration-300 font-medium"
                disabled={isLoading}
              >
                Exit Interview
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={isLoading || isRecording || recordedChunks.length === 0}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 
                         transition-all duration-300 transform hover:scale-105 
                         disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center space-x-3 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium">Next Question</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Recording History */}
            <AnimatePresence>
              {conversationHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 border-t pt-6"
                >
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    Previous Responses
                  </h4>
                  <div className="space-y-6">
                    {conversationHistory.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-xl overflow-hidden shadow-md"
                      >
                        <div className="p-4 bg-gray-100 border-b">
                          <p className="font-medium text-gray-800">
                            Question {index + 1}: {entry.question}
                          </p>
                        </div>
                        <div className="p-4">
                          <video 
                            src={entry.answer} 
                            controls 
                            className="w-full rounded-lg"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default VideoInterview;