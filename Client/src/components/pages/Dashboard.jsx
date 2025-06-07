import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,  
  PlayCircle,  
  CheckCircle,  
  XCircle,
  Clock,
  BarChart4,
  ArrowRight,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { axiosPrivate } from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchInterviews = async () => {
      try {
        const response = await axiosPrivate.get('http://localhost:8080/interview/scheduled');
        const processedInterviews = response.data.map(interview => ({
          id: interview._id,
          title: interview.title,
          domain: interview.domain,
          type: interview.type,
          scheduledAt: new Date(interview.scheduledAt),
          deadline: new Date(interview.deadline),
          description: interview.description,
          status: determineInterviewStatus(interview)
        }));
        setInterviews(processedInterviews);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [axiosPrivate]);

  const determineInterviewStatus = (interview) => {
    const now = new Date();
    const scheduledAt = new Date(interview.scheduledAt);
    const deadline = new Date(interview.deadline);

    if (now > deadline) return 'Expired';
    if (now >= scheduledAt && now <= deadline) return 'Active';
    return 'Upcoming';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Upcoming': return <Clock className="text-blue-400" />;
      case 'Active': return <CheckCircle className="text-emerald-400" />;
      case 'Expired': return <XCircle className="text-red-400" />;
      default: return <Clock className="text-gray-400" />;
    }
  };

  const getStatusBadgeClasses = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5";
    switch(status) {
      case 'Upcoming': return `${baseClasses} bg-blue-500/10 text-blue-400 border border-blue-500/20`;
      case 'Active': return `${baseClasses} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`;
      case 'Expired': return `${baseClasses} bg-red-500/10 text-red-400 border border-red-500/20`;
      default: return `${baseClasses} bg-gray-500/10 text-gray-400 border border-gray-500/20`;
    }
  };

  const handlePractice = () => {
    navigate('/complete-profile');
  };

  const filteredInterviews = activeFilter === 'all' 
    ? interviews 
    : interviews.filter(interview => interview.status.toLowerCase() === activeFilter.toLowerCase());

  const fadeIn = (delay = 0) => ({
    opacity: isVisible ? 1 : 0, 
    y: isVisible ? 0 : 20,
    transition: { 
      duration: 0.5, 
      delay: delay,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  const stats = [
    { number: filteredInterviews.filter(i => i.status === 'Upcoming').length, label: "Upcoming", color: "from-blue-400 to-blue-500" },
    { number: filteredInterviews.filter(i => i.status === 'Active').length, label: "Active", color: "from-emerald-400 to-emerald-500" },
    { number: filteredInterviews.filter(i => i.status === 'Expired').length, label: "Expired", color: "from-red-400 to-red-500" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-200">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white p-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12" style={fadeIn(0.1)}>
          <div>
            <div className="inline-block mb-3 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md">
              <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
                <Sparkles size={16} className="text-indigo-200" />
                <span className="text-sm font-medium text-indigo-100">
                  Your Interview Dashboard
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200">
              Welcome back, {auth?.user?.name || 'User'}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button 
              onClick={handlePractice}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full font-medium
                      hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 
                      shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 flex items-center justify-center"
            >
              Practice Interview
              <ArrowRight className="ml-1.5" size={16} />
            </button>
            
            <button 
              onClick={() => navigate('/schedule-interview')}
              className="px-5 py-2.5 bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 rounded-full font-medium
                       hover:bg-indigo-800/50 transition-all duration-300 flex items-center justify-center"
            >
              <PlusCircle size={16} className="mr-1.5" />
              Schedule New
            </button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          style={fadeIn(0.2)}
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-indigo-800/40
                       hover:border-indigo-600/70 transition-all duration-300
                       hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <h3 className="text-indigo-300 font-medium mb-2">{stat.label} Interviews</h3>
              <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {stat.number}
              </p>
            </div>
          ))}
        </div>
        
        {/* Filter Section */}
        <div 
          className="flex flex-wrap gap-2 mb-6"
          style={fadeIn(0.3)}
        >
          {['all', 'upcoming', 'active', 'expired'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/60 text-indigo-200 hover:bg-slate-700/60'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Interviews List */}
        <div 
          className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-indigo-800/40 overflow-hidden"
          style={fadeIn(0.4)}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-indigo-100 mb-6 flex items-center">
              <BarChart4 className="mr-2 text-indigo-400" size={20} />
              {activeFilter === 'all' ? 'All' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Interviews
            </h2>
            
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-indigo-400 mb-3" size={48} />
                <p className="text-indigo-200 mb-2">No {activeFilter === 'all' ? '' : activeFilter} interviews found</p>
                <p className="text-indigo-300/70 text-sm">Schedule your next interview to practice and improve</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInterviews.map((interview, index) => (
                  <div 
                    key={interview.id}
                    onClick={() => navigate(`/interview-details/${interview.id}`)}
                    className="group flex justify-between items-center bg-slate-700/30 hover:bg-slate-700/50 p-5 rounded-xl border border-indigo-800/30 
                              hover:border-indigo-600/50 cursor-pointer transition-all duration-300
                              hover:shadow-md hover:shadow-indigo-900/30"
                    style={{
                      ...fadeIn(0.5 + index * 0.05),
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-900/60 p-3 rounded-lg">
                        <Calendar className="text-indigo-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-indigo-100 group-hover:text-white transition-colors">{interview.title}</p>
                        <div className="flex items-center text-sm text-indigo-300/70 mt-1">
                          <span>{interview.scheduledAt.toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{interview.scheduledAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="mx-2">•</span>
                          <span>{interview.domain}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={getStatusBadgeClasses(interview.status)}>
                        {getStatusIcon(interview.status)}
                        {interview.status}
                      </span>
                      <ArrowRight size={16} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Tips */}
        <div 
          className="mt-8 bg-gradient-to-r from-indigo-800/30 to-blue-900/30 backdrop-blur-md p-6 rounded-xl border border-indigo-700/30"
          style={fadeIn(0.6)}
        >
          <h3 className="text-lg font-semibold text-indigo-100 mb-3">Pro Tips</h3>
          <p className="text-indigo-200/80">
            Regular practice is key to interview success. Try to schedule at least one mock interview each week
            and review your performance analytics to identify improvement areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;