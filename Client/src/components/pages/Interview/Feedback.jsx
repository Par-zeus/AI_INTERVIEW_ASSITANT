import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Award, 
  CheckCircle, 
  ThumbsUp, 
  AlertCircle, 
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Star,
  Lightbulb,
  AlertTriangle,
  Clipboard,
  TrendingUp,
  PieChart,
  Eye,
  BookOpen,
  ArrowRight,
  BarChart3,
  Clock,
  User,
  Calendar,
  Smile,
  Frown,
  Meh,
  Heart,
  Activity
} from 'lucide-react';

const Feedback = () => {
  const location = useLocation();
  const [feedbackData , setFeedbackData] =useState(null)
  console.log('Received Feedback Data:', feedbackData);
  const axiosPrivate = useAxiosPrivate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [interviewDate, setInterviewDate] = useState(new Date().toLocaleDateString());

  // Define emotion mapping for visual elements
  const emotionIcons = {
    'anger': <Frown className="text-red-500" />,
    'neutral': <Meh className="text-blue-500" />,
    'fear': <AlertCircle className="text-purple-500" />,
    'sad': <Frown className="text-blue-500" />,
    'disgust': <Frown className="text-green-500" />,
    'happy': <Smile className="text-yellow-500" />,
    'surprise': <AlertCircle className="text-orange-500" />
  };

  const emotionColors = {
    'anger': 'bg-red-500',
    'neutral': 'bg-blue-500',
    'fear': 'bg-purple-500',
    'sad': 'bg-blue-600',
    'disgust': 'bg-green-500',
    'happy': 'bg-yellow-500',
    'surprise': 'bg-orange-500'
  };

  useEffect(() => {
    const fetchVideoAnalysis = async () => {
      try {
        const response = await axiosPrivate.get(`/api/interview/${interviewId}/video-analysis`);
        setFeedbackData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching video analysis:", error);
        setIsLoading(false);
      }};
    const getFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(`/api/interview/feedback/${interviewId}`);
        setFeedbackList(response.data);
        
        // Set mock interview date - in production this would come from the API
        if (response.data && response.data.length > 0) {
          setInterviewDate(new Date().toLocaleDateString());
        }
        
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to fetch interview feedback', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsLoading(false);
        navigate('/interview');
      }
    };

    getFeedback();
    fetchVideoAnalysis();
  }, [interviewId, navigate, axiosPrivate]);

  const toggleCollapsible = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Calculate overall performance and metrics
  const calculateOverallRating = () => {
    if (!feedbackList.length) return 0;
    const totalRating = feedbackList.reduce((sum, item) => sum + parseFloat(item.rating || 0), 0);
    return (totalRating / feedbackList.length).toFixed(1);
  };

  const calculatePerformanceMetrics = () => {
    if (!feedbackList.length) return { excellent: 0, good: 0, average: 0, needsWork: 0 };
    
    const metrics = feedbackList.reduce((acc, item) => {
      const rating = parseFloat(item.rating || 0);
      if (rating >= 9) acc.excellent++;
      else if (rating >= 7) acc.good++;
      else if (rating >= 5) acc.average++;
      else acc.needsWork++;
      return acc;
    }, { excellent: 0, good: 0, average: 0, needsWork: 0 });
    
    return metrics;
  };

  const getPerformanceLevel = (rating) => {
    rating = parseFloat(rating);
    if (rating >= 9) return { label: 'Excellent', color: 'emerald' };
    else if (rating >= 7) return { label: 'Good', color: 'blue' };
    else if (rating >= 5) return { label: 'Average', color: 'amber' };
    else return { label: 'Needs Work', color: 'rose' };
  };

  const metrics = calculatePerformanceMetrics();
  const overallRating = calculateOverallRating();
  
  // Calculate percentages for the chart
  const calculatePercentages = () => {
    const total = feedbackList.length;
    if (!total) return { excellent: 0, good: 0, average: 0, needsWork: 0 };
    
    return {
      excellent: Math.round((metrics.excellent / total) * 100),
      good: Math.round((metrics.good / total) * 100),
      average: Math.round((metrics.average / total) * 100),
      needsWork: Math.round((metrics.needsWork / total) * 100)
    };
  };
  
  const percentages = calculatePercentages();
  
  // Get the dominant emotion from the emotion breakdown
  const getDominantEmotion = () => {
    if (!feedbackData  || !feedbackData.videoAnalysis.emotionBreakdown) {
      return { emotion: 'neutral', percentage: 0 };
    }
    
    const emotions = feedbackData.videoAnalysis.emotionBreakdown;
    let maxEmotion = 'neutral';
    let maxValue = 0;
    
    Object.entries(emotions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    });
    
    return { emotion: maxEmotion, percentage: maxValue };
  };
  
  const dominantEmotion = getDominantEmotion();
  
  // Calculate total for emotions to get percentages
  const calculateEmotionPercentages = () => {
    if (!feedbackData || !feedbackData.videoAnalysis.emotionBreakdown) {
      return {};
    }
    
    const emotions =feedbackData.videoAnalysis.emotionBreakdown;
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    
    const percentages = {};
    Object.entries(emotions).forEach(([emotion, value]) => {
      percentages[emotion] = total > 0 ? Math.round((value / total) * 100) : 0;
    });
    
    return percentages;
  };
  
  const emotionPercentages = calculateEmotionPercentages();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-solid rounded-full border-t-transparent animate-spin mb-2"></div>
          <span className="text-violet-300 font-medium mt-2">Loading your feedback...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200">
                Interview Feedback
              </h1>
              <p className="text-indigo-200 mt-2">
                Review your performance and insights from your mock interview
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3 text-sm text-indigo-200">
              <Calendar size={16} />
              <span>{interviewDate}</span>
              <span className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 px-2 py-1 rounded-full text-xs font-medium">
                Technical Interview
              </span>
            </div>
          </div>
        </div>

        {/* Emotion Analysis Card - New Section */}
        {feedbackData &&feedbackData.videoAnalysis && (
          <div className="mb-8 bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-indigo-200">Emotion Analysis</h2>
              <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 px-3 py-1 rounded-full text-xs font-medium text-indigo-200">
                Confidence: {feedbackData.videoAnalysis.confidence}/10
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dominant Emotion */}
              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-indigo-800/30">
                <h3 className="text-lg font-medium text-indigo-100 mb-3">Dominant Emotion</h3>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${emotionColors[dominantEmotion.emotion] || 'bg-blue-500'}`}>
                    {emotionIcons[dominantEmotion.emotion] || <Meh size={32} className="text-white" />}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white capitalize">{dominantEmotion.emotion}</p>
                    <p className="text-indigo-300">Primary emotion detected in your interview</p>
                  </div>
                </div>
              </div>
              
              {/* Emotion Breakdown */}
              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-indigo-800/30">
                <h3 className="text-lg font-medium text-indigo-100 mb-3">Emotion Breakdown</h3>
                <div className="space-y-3">
                  {feedbackData.videoAnalysis.emotionBreakdown && Object.entries(feedbackData.videoAnalysis.emotionBreakdown)
                    .filter(([_, value]) => value > 0)
                    .sort(([_, a], [__, b]) => b - a)
                    .map(([emotion, value]) => (
                      <div key={emotion}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-indigo-200 capitalize">{emotion}</span>
                          <span className="text-sm font-medium text-indigo-100">{emotionPercentages[emotion]}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`${emotionColors[emotion] || 'bg-blue-500'} h-2 rounded-full`} 
                            style={{ width: `${emotionPercentages[emotion]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Emotion Insights */}
              <div className="md:col-span-2 bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-indigo-800/30">
                <h3 className="text-lg font-medium text-indigo-100 mb-3">Emotion Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-900/40 rounded-lg p-4 border border-indigo-700/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Heart className="text-indigo-300" size={20} />
                      <h4 className="font-medium text-indigo-100">What This Means</h4>
                    </div>
                    <p className="text-indigo-200 text-sm">
                      {dominantEmotion.emotion === 'happy' && "Your positive demeanor indicates confidence and engagement!"}
                      {dominantEmotion.emotion === 'sad' && "You may have appeared hesitant or uncertain during some responses."}
                      {dominantEmotion.emotion === 'disgust' && "You might have shown discomfort with certain questions or topics."}
                      {dominantEmotion.emotion === 'anger' && "Some responses may have come across as defensive or frustrated."}
                      {dominantEmotion.emotion === 'fear' && "Your responses may have shown anxiety or nervousness."}
                      {dominantEmotion.emotion === 'surprise' && "You may have appeared unprepared for some questions."}
                      {dominantEmotion.emotion === 'neutral' && "You maintained a composed, professional demeanor throughout."}
                    </p>
                  </div>
                  
                  <div className="bg-indigo-900/40 rounded-lg p-4 border border-indigo-700/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Activity className="text-indigo-300" size={20} />
                      <h4 className="font-medium text-indigo-100">Impact on Interview</h4>
                    </div>
                    <p className="text-indigo-200 text-sm">
                      {dominantEmotion.emotion === 'happy' && "Positive emotions create rapport and show enthusiasm for the role."}
                      {dominantEmotion.emotion === 'sad' && "Appearing downcast might give the impression of low interest or energy."}
                      {dominantEmotion.emotion === 'disgust' && "Discomfort can be interpreted as lack of interest or poor cultural fit."}
                      {dominantEmotion.emotion === 'anger' && "Appearing agitated can raise concerns about handling pressure."}
                      {dominantEmotion.emotion === 'fear' && "Nervousness may undermine the confidence in your capabilities."}
                      {dominantEmotion.emotion === 'surprise' && "Looking surprised might indicate lack of preparation."}
                      {dominantEmotion.emotion === 'neutral' && "A balanced demeanor projects professionalism and composure."}
                    </p>
                  </div>
                  
                  <div className="bg-indigo-900/40 rounded-lg p-4 border border-indigo-700/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Lightbulb className="text-indigo-300" size={20} />
                      <h4 className="font-medium text-indigo-100">Recommendation</h4>
                    </div>
                    <p className="text-indigo-200 text-sm">
                      {dominantEmotion.emotion === 'happy' && "Continue with your positive approach while ensuring answers are substantive."}
                      {dominantEmotion.emotion === 'sad' && "Practice confidence-building exercises and more energetic delivery."}
                      {dominantEmotion.emotion === 'disgust' && "Work on maintaining a neutral expression even when discussing challenges."}
                      {dominantEmotion.emotion === 'anger' && "Focus on stress management techniques and reframing challenges positively."}
                      {dominantEmotion.emotion === 'fear' && "Additional preparation and mock interviews can help reduce anxiety."}
                      {dominantEmotion.emotion === 'surprise' && "Research common interview questions more thoroughly before interviews."}
                      {dominantEmotion.emotion === 'neutral' && "Add some enthusiasm while maintaining your excellent composure."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Feedback Handling */}
        {feedbackList?.length === 0 ? (
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center border border-indigo-800/40">
            <div className="bg-indigo-900/40 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <MessageCircle size={36} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-semibold text-indigo-100 mb-2">No Feedback Available</h2>
            <p className="text-indigo-200 mb-8">Your interview feedback has not been processed yet. Please check back later.</p>
            <button 
              onClick={() => navigate('/interview')}
              className="px-6 py-3 bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 text-indigo-100 font-medium rounded-lg hover:bg-indigo-800/50 transition-all"
            >
              Return to Interview Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Overall Score Card */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-md overflow-hidden border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-100">Overall Score</h3>
                    <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 p-2 rounded-lg">
                      <PieChart size={20} className="text-indigo-300" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative w-24 h-24">
                      {/* Circular progress background */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#334155" 
                          strokeWidth="10"
                        />
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={
                            parseFloat(overallRating) >= 9 ? "#10b981" :
                            parseFloat(overallRating) >= 7 ? "#3b82f6" :
                            parseFloat(overallRating) >= 5 ? "#f59e0b" : "#f43f5e"
                          }
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * (parseFloat(overallRating) / 10))}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-indigo-100">{overallRating}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className="flex items-center mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            size={18}
                            fill={star <= Math.round(overallRating/2) ? 
                              (parseFloat(overallRating) >= 9 ? "#10b981" :
                               parseFloat(overallRating) >= 7 ? "#3b82f6" :
                               parseFloat(overallRating) >= 5 ? "#f59e0b" : "#f43f5e") 
                              : "none"}
                            className={
                              parseFloat(overallRating) >= 9 ? "text-emerald-500" :
                              parseFloat(overallRating) >= 7 ? "text-blue-500" :
                              parseFloat(overallRating) >= 5 ? "text-amber-500" : "text-rose-500"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-indigo-200 text-sm">Based on {feedbackList.length} question responses</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          parseFloat(overallRating) >= 9 ? "bg-emerald-900/40 text-emerald-300" :
                          parseFloat(overallRating) >= 7 ? "bg-blue-900/40 text-blue-300" :
                          parseFloat(overallRating) >= 5 ? "bg-amber-900/40 text-amber-300" : 
                          "bg-rose-900/40 text-rose-300"
                        }`}>
                          {
                            parseFloat(overallRating) >= 9 ? "Excellent" :
                            parseFloat(overallRating) >= 7 ? "Good" :
                            parseFloat(overallRating) >= 5 ? "Average" : "Needs Work"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Distribution */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-md overflow-hidden border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-100">Performance Distribution</h3>
                    <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 p-2 rounded-lg">
                      <BarChart3 size={20} className="text-indigo-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-indigo-200">Excellent</span>
                        <span className="text-sm font-medium text-emerald-300">{percentages.excellent}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentages.excellent}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-indigo-200">Good</span>
                        <span className="text-sm font-medium text-blue-300">{percentages.good}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentages.good}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-indigo-200">Average</span>
                        <span className="text-sm font-medium text-amber-300">{percentages.average}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${percentages.average}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-indigo-200">Needs Work</span>
                        <span className="text-sm font-medium text-rose-300">{percentages.needsWork}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${percentages.needsWork}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-md overflow-hidden border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-100">Quick Stats</h3>
                    <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 p-2 rounded-lg">
                      <Clock size={20} className="text-indigo-300" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 p-2 rounded-lg">
                          <User size={16} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-xs text-indigo-200">Questions</p>
                          <p className="text-lg font-semibold text-indigo-100">{feedbackList.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-emerald-900/40 backdrop-blur-sm border border-emerald-700/50 p-2 rounded-lg">
                          <ThumbsUp size={16} className="text-emerald-300" />
                        </div>
                        <div>
                          <p className="text-xs text-indigo-200">Top Score</p>
                          <p className="text-lg font-semibold text-indigo-100">
                            {Math.max(...feedbackList.map(item => parseFloat(item.rating) || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-amber-900/40 backdrop-blur-sm border border-amber-700/50 p-2 rounded-lg">
                          <Eye size={16} className="text-amber-300" />
                        </div>
                        <div>
                          <p className="text-xs text-indigo-200">Areas for Growth</p>
                          <p className="text-lg font-semibold text-indigo-100">{metrics.needsWork + metrics.average}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/50 p-2 rounded-lg">
                          <Award size={16} className="text-blue-300" />
                        </div>
                        <div>
                          <p className="text-xs text-indigo-200">Strengths</p>
                          <p className="text-lg font-semibold text-indigo-100">{metrics.excellent + metrics.good}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Questions & Feedback List */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Question Breakdown</h2>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">{feedbackList.length}</span> questions analyzed
                </div>
              </div>
              
              <div className="space-y-4">
                {feedbackList.map((item, index) => {
                  const performance = getPerformanceLevel(item.rating);
                  const performanceColor = {
                    emerald: 'bg-emerald-500',
                    blue: 'bg-blue-500',
                    amber: 'bg-amber-500',
                    rose: 'bg-rose-500'
                  }[performance.color];
                  
                  const performanceBgColor = {
                    emerald: 'bg-emerald-50',
                    blue: 'bg-blue-50',
                    amber: 'bg-amber-50',
                    rose: 'bg-rose-50'
                  }[performance.color];
                  
                  const performanceTextColor = {
                    emerald: 'text-emerald-700',
                    blue: 'text-blue-700',
                    amber: 'text-amber-700',
                    rose: 'text-rose-700'
                  }[performance.color];
                  
                  return (
                    <div 
                      key={index} 
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-100"
                    >
                      <div 
                        onClick={() => toggleCollapsible(index)}
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-1.5 h-16 rounded-full ${performanceColor}`}></div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${performanceBgColor} ${performanceTextColor}`}>
                                Question {index + 1}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${performanceBgColor} ${performanceTextColor}`}>
                                {performance.label}
                              </span>
                            </div>
                            <h3 className="text-lg font-medium text-slate-800">{item.question}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${performanceBgColor}`}>
                              <span className={`text-xl font-bold ${performanceTextColor}`}>{item.rating}</span>
                            </div>
                            <span className="ml-2 text-sm text-slate-500">/10</span>
                          </div>
                          {openIndex === index ? 
                            <ChevronUp size={20} className="text-slate-400" /> : 
                            <ChevronDown size={20} className="text-slate-400" />
                          }
                        </div>
                      </div>
                      
                      {openIndex === index && (
                        <div className="p-5 border-t border-slate-100 bg-white">
                          {/* Feedback UI Updated */}
                          <div className="grid md:grid-cols-2 gap-5">
                            {/* Left Column */}
                            <div className="space-y-5">
                              {/* Feedback Section */}
                              <div className="bg-violet-50 rounded-xl p-5">
                                <div className="flex items-center mb-3">
                                  <MessageCircle size={18} className="text-violet-600 mr-2" />
                                  <h4 className="text-violet-800 font-medium">Detailed Feedback</h4>
                                </div>
                                <p className="text-slate-700">{item.feedback}</p>
                              </div>
                              
                              {/* Performance Visualization */}
                              <div className="bg-slate-50 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center">
                                    <Award size={18} className="text-slate-600 mr-2" />
                                    <h4 className="text-slate-800 font-medium">Performance Assessment</h4>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${performanceColor}`}>
                                    {performance.label}
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="relative h-7 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${performanceColor} rounded-full transition-all duration-1000 ease-out`}
                                      style={{ width: `${(item.rating / 10) * 100}%` }}
                                    ></div>
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-3">
                                      <span className="text-xs font-medium text-white">0</span>
                                      <span className="text-xs font-medium text-white">10</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-5 gap-1 mt-4">
                                    <div className="text-center">
                                      <div className="bg-rose-100 h-1.5 w-full rounded-full mb-1"></div>
                                      <span className="text-xs text-slate-500">Poor</span>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-rose-300 h-1.5 w-full rounded-full mb-1"></div>
                                      <span className="text-xs text-slate-500">Fair</span>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-amber-300 h-1.5 w-full rounded-full mb-1"></div>
                                      <span className="text-xs text-slate-500">Average</span>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-blue-300 h-1.5 w-full rounded-full mb-1"></div>
                                      <span className="text-xs text-slate-500">Good</span>
                                    </div>
                                    <div className="text-center">
                                      <div className="bg-emerald-300 h-1.5 w-full rounded-full mb-1"></div>
                                      <span className="text-xs text-slate-500">Excellent</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Improvement Tips */}
                              <div className="bg-amber-50 rounded-xl p-5">
                                <div className="flex items-center mb-3">
                                  <Lightbulb size={18} className="text-amber-600 mr-2" />
                                  <h4 className="text-amber-800 font-medium">Improvement Tips</h4>
                                </div>
                                <ul className="text-slate-700 space-y-2">
                                  <li className="flex items-start">
                                    <TrendingUp size={16} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                                    <span>Focus on providing more concrete examples to support your answers.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <AlertTriangle size={16} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                                    <span>Be more concise while still addressing all parts of the question.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <ThumbsUp size={16} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                                    <span>Continue using the structured approach you demonstrated in this answer.</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            
                            {/* Right Column */}
                            <div className="space-y-5">
                              {/* Your Answer */}
                              <div className="bg-slate-50 rounded-xl p-5">
                                <div className="flex items-center mb-3">
                                  <User size={18} className="text-slate-600 mr-2" />
                                  <h4 className="text-slate-800 font-medium">Your Answer</h4>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                  <p className="text-slate-600 italic">{item.userAns}</p>
                                </div>
                              </div>
                              
                              {/* Model Answer */}
                              <div className="bg-emerald-50 rounded-xl p-5">
                                <div className="flex items-center mb-3">
                                  <CheckCircle size={18} className="text-emerald-600 mr-2" />
                                  <h4 className="text-emerald-800 font-medium">Model Answer</h4>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-emerald-100">
                                  <p className="text-slate-700">{item.correctAns}</p>
                                </div>
                              </div>
                              
                              {/* Key Takeaways */}
                              <div className="bg-blue-50 rounded-xl p-5">
                                <div className="flex items-center mb-3">
                                  <BookOpen size={18} className="text-blue-600 mr-2" />
                                  <h4 className="text-blue-800 font-medium">Key Takeaways</h4>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium text-xs">1</span>
                                    </div>
                                    <p className="text-slate-700 text-sm">Focus on structured responses with clear beginning, middle, and end.</p>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium text-xs">2</span>
                                    </div>
                                    <p className="text-slate-700 text-sm">Use specific examples from your experience to illustrate points.</p>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-medium text-xs">3</span>
                                    </div>
                                    <p className="text-slate-700 text-sm">Address all components of multi-part questions thoroughly.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Performance Summary */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-8">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white">
                <h2 className="text-2xl font-semibold mb-1">Performance Summary</h2>
                <p className="text-violet-100">Comprehensive analysis of your interview strengths and areas for improvement</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                        <ThumbsUp size={20} className="text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-emerald-800">Your Strengths</h4>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <CheckCircle size={18} className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Strong Technical Knowledge</h5>
                          <p className="text-slate-600 text-sm">You demonstrated solid understanding of core concepts and fundamentals.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <CheckCircle size={18} className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Well-Structured Responses</h5>
                          <p className="text-slate-600 text-sm">Your answers followed a logical flow making them easy to follow.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <CheckCircle size={18} className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Communication Skills</h5>
                          <p className="text-slate-600 text-sm">You explained complex concepts clearly and concisely.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-amber-100 p-2 rounded-lg mr-3">
                        <AlertTriangle size={20} className="text-amber-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-amber-800">Areas for Growth</h4>
                    </div>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <AlertCircle size={18} className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Concrete Examples</h5>
                          <p className="text-slate-600 text-sm">Include more specific examples from past experiences to support your points.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <AlertCircle size={18} className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Answer Conciseness</h5>
                          <p className="text-slate-600 text-sm">Work on providing more focused answers without unnecessary details.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start bg-white p-3 rounded-lg shadow-sm">
                        <AlertCircle size={18} className="text-amber-500 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-slate-800 mb-1">Measurable Outcomes</h5>
                          <p className="text-slate-600 text-sm">Include more specific metrics and results in your achievement descriptions.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 bg-slate-50 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-slate-800 mb-1">Expert Recommendation</h3>
                    <p className="text-slate-600">
                      We recommend scheduling a follow-up practice interview in 7-10 days to implement these improvements.
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <a href="#" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-violet-700 hover:text-violet-800 bg-violet-100 hover:bg-violet-200 transition-all">
                      View Detailed Report
                    </a>
                    <a href="#" className="ml-3 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-all">
                      Schedule Follow-up
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate('/interview')}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium flex items-center justify-center hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/20"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Interview Dashboard
              </button>
              
              <button 
                className="px-6 py-4 rounded-xl bg-white text-violet-600 font-medium border border-violet-100 flex items-center justify-center hover:bg-violet-50 transition-all shadow-sm"
              >
                <AlertCircle size={18} className="mr-2" />
                Request Expert Review
              </button>
            </div>
            
           
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;