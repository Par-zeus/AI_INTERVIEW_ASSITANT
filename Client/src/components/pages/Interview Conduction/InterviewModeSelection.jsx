import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Users,
  Bot,
  CheckCircle,
  Camera,
  Globe
} from 'lucide-react';

const InterviewModeSelection = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  // Animation utility function
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: isVisible ? 1 : 0, 
      y: isVisible ? 0 : 20 
    },
    transition: { 
      duration: 0.6, 
      delay: delay,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  const scaleIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.92 },
    animate: { 
      opacity: isVisible ? 1 : 0, 
      scale: isVisible ? 1 : 0.92
    },
    transition: { 
      duration: 0.5, 
      delay: delay,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  // Interview features
  const features = [
    {
      icon: <Camera className="text-indigo-300" size={24} />,
      title: "Video Response Recording",
      description: "Practice answering questions in a simulated interview environment with video recording capabilities"
    },
    {
      icon: <CheckCircle className="text-indigo-300" size={24} />,
      title: "AI-Powered Feedback",
      description: "Receive detailed feedback on your communication style, body language, and response quality"
    },
    {
      icon: <Globe className="text-indigo-300" size={24} />,
      title: "Role-Specific Questions",
      description: "Face questions tailored specifically for the selected role and industry standards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white pb-16">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-indigo-300 hover:text-indigo-100 transition-colors mb-8"
          style={fadeIn(0.1).animate}
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back</span>
        </button>

        {/* Header */}
        <div 
          className="text-center mb-12 lg:mb-16"
          style={fadeIn(0.2).animate}
        >
          <div className="inline-block mb-6 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md">
            <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">
                Video Interview Session
              </span>
            </div>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
          >
            Ready for Your Interview?
          </h2>
          
          <div className="inline-flex items-center px-5 py-2 bg-indigo-900/40 rounded-full backdrop-blur-sm border border-indigo-700/50 mb-4">
            <span className="text-indigo-300 mr-2">Role:</span>
            <span className="font-semibold text-white">{role}</span>
          </div>
          
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Our video interview simulation provides a realistic experience with personalized AI feedback
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
          {/* Left Column - Video Interview Card */}
          <div
            style={scaleIn(0.3).animate}
            className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                      hover:border-indigo-600/70 transition-all duration-300
                      hover:shadow-2xl hover:shadow-indigo-600/10 group relative overflow-hidden"
          >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500
                          bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
            
            {/* Card Content */}
            <div className="p-8 relative z-10">
              <div className="inline-flex items-center justify-center p-4 mb-5 bg-indigo-900/70 rounded-xl
                            transform group-hover:scale-105 transition-transform duration-300">
                <Video className="text-indigo-300" size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-indigo-100 mb-4 group-hover:text-white transition-colors">
                Video Interview Experience
              </h3>
              
              <p className="text-indigo-200/80 mb-6">
                Our immersive video interview simulator creates a realistic interview environment where you can practice your responses while being recorded. Receive comprehensive AI feedback on your verbal and non-verbal communication.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-indigo-200">Full video recording capabilities</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-indigo-200">Body language and facial expression analysis</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-indigo-200">Speech pattern and confidence assessment</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-indigo-200">Realistic question-answer format</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                  <span className="text-indigo-200">Detailed response improvement suggestions</span>
                </div>
              </div>
              
              {/* Start Button */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-indigo-800/30">
                <span className="text-sm text-indigo-300">
                  15-30 minutes
                </span>
                
                <button 
                  onClick={() => navigate('/interview')}
                  className="flex items-center text-indigo-200 group-hover:text-white
                           px-4 py-2 rounded-full bg-indigo-900/50 group-hover:bg-indigo-700/50
                           transition-all duration-300"
                >
                  Start Interview
                  <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - How It Works */}
          <div 
            style={fadeIn(0.4).animate}
            className="flex flex-col space-y-8"
          >
            <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-indigo-800/40">
              <h3 className="text-xl font-bold text-indigo-100 mb-4">How The Interview Works</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900/70 text-indigo-200 font-semibold mr-3 mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium text-indigo-100">Prepare Your Setup</h4>
                    <p className="text-sm text-indigo-200/80 mt-1">Find a quiet space with good lighting and ensure your camera and microphone are working properly.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900/70 text-indigo-200 font-semibold mr-3 mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium text-indigo-100">Answer Interview Questions</h4>
                    <p className="text-sm text-indigo-200/80 mt-1">You'll be presented with role-specific questions to answer on camera within a time limit.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900/70 text-indigo-200 font-semibold mr-3 mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium text-indigo-100">Receive AI Feedback</h4>
                    <p className="text-sm text-indigo-200/80 mt-1">After completing the interview, get comprehensive feedback on your performance with improvement tips.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-900/70 text-indigo-200 font-semibold mr-3 mt-0.5">4</div>
                  <div>
                    <h4 className="font-medium text-indigo-100">Review & Improve</h4>
                    <p className="text-sm text-indigo-200/80 mt-1">Watch your responses, study the feedback, and practice again to enhance your skills.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-indigo-600/20 backdrop-blur-md p-6 rounded-2xl border border-indigo-700/40">
              <div className="flex items-start">
                <div className="p-3 bg-indigo-900/70 rounded-xl mr-4">
                  <Bot className="text-indigo-300" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-100 mb-2">AI-Powered Interview Coach</h3>
                  <p className="text-indigo-200/90 text-sm">
                    Our intelligent system analyzes your responses, body language, and speech patterns to provide personalized coaching that helps you improve with each practice session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div 
          className="bg-indigo-900/30 backdrop-blur-lg py-10 rounded-2xl border border-indigo-800/40 max-w-5xl mx-auto"
          style={fadeIn(0.6).animate}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center px-6">
              <Calendar className="text-indigo-300 mb-4" size={32} />
              <h4 className="text-2xl font-bold text-white mb-2">30+</h4>
              <p className="text-indigo-200">Interview scenarios per role</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-6 border-y md:border-y-0 md:border-x border-indigo-700/30 py-6 md:py-0">
              <Clock className="text-indigo-300 mb-4" size={32} />
              <h4 className="text-2xl font-bold text-white mb-2">24/7</h4>
              <p className="text-indigo-200">Practice whenever suits you</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-6">
              <Bot className="text-indigo-300 mb-4" size={32} />
              <h4 className="text-2xl font-bold text-white mb-2">AI-Driven</h4>
              <p className="text-indigo-200">Adaptive interview difficulty</p>
            </div>
          </div>
        </div>
        
        {/* Information Footer */}
        <div 
          className="mt-16 text-center" 
          style={fadeIn(0.7).animate}
        >
          <div className="inline-flex items-center justify-center space-x-2 bg-indigo-900/40 backdrop-blur-sm
                        border border-indigo-700/50 rounded-full px-6 py-3 shadow-lg shadow-indigo-900/20">
            <Users className="text-indigo-400" size={20} />
            <span className="text-indigo-200 font-medium text-sm">
              Join 10,000+ professionals improving their interview skills
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewModeSelection;