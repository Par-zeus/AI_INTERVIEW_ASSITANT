import React, { useState, useEffect, useRef } from 'react';  // Added useRef
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Save, Loader2 } from 'lucide-react';
import { interviewService } from '../../../services/interviewService';
import useAuth from '../../../hooks/useAuth';
const OralInterview = () => {
  const { role } = useParams();
  const {auth} =useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about yourself and your background in this field."
  );
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition once and store in ref
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prevTranscript) => prevTranscript + ' ' + transcriptText);
          } else {
            interimTranscript += transcriptText; // Optional: display interim transcript
          }
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    } else {
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setTranscript(''); // Clear previous transcript
    setIsRecording(true);
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      recognitionRef.current.stop();
      setTimeout(() => {
        recognitionRef.current.start();
      }, 100);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const saveTranscript = async (conversationData) => {
    try {
      const response = await interviewService.saveTranscript({conversationData,email:auth.email});
      return response;
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw error;
    }
  };

  
  const getNextQuestion = async (lastAnswer) => {
    try {
      setIsLoading(true);
      const response = await interviewService.getNextQuestion(lastAnswer, role, conversationHistory);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error getting next question:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextQuestion = async () => {
    try {
      const newHistory = [
        ...conversationHistory,
        { question: currentQuestion, answer: transcript },
      ];
      setConversationHistory(newHistory);
  
      // Save transcript to backend
      // await saveTranscript(newHistory);
  
      // Save locally
      localStorage.setItem('interviewResponses', JSON.stringify(newHistory));
      console.log(currentQuestionIndex);
      if (currentQuestionIndex == 4) {
        
      await saveTranscript(newHistory);
        setIsInterviewComplete(true);
        navigate("/transcript");
      }
  
      const nextQuestion = await getNextQuestion(transcript);
      setCurrentQuestion(nextQuestion);
      setTranscript('');
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      setError('Failed to proceed to next question. Please try again.');
    }
  };
  

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-red-600 font-semibold mb-4">Error</h3>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-teal-800 mb-2">
              {role} Interview
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1}
              </p>
              <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question and Recording Section */}
          <div className="mb-8">
            <div className="bg-teal-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{currentQuestion}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={`p-6 rounded-full transition-all duration-300 transform hover:scale-110
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' :
                    isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your response will appear here as you speak..."
                  className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  readOnly
                />
                {isRecording && (
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                    <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm text-gray-500">Recording...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/interview/mode/' + role)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              disabled={isLoading}
            >
              Exit Interview
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={isLoading || !transcript.trim()}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Next Question</span>
                  <Save className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Previous Responses</h4>
              <div className="space-y-4">
                {conversationHistory.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-teal-800 mb-2">Q: {entry.question}</p>
                    <p className="text-gray-700">A: {entry.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OralInterview;
