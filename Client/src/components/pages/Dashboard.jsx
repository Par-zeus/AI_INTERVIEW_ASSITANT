import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,  
  PlayCircle,  
  CheckCircle,  
  XCircle  
} from 'lucide-react';
import { axiosPrivate } from '../../api/axios';
// import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { auth } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Upcoming': return 'text-blue-600';
      case 'Active': return 'text-green-600';
      case 'Expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handlePractice = () => {
    navigate('/user-profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <div className="container mx-auto">
        <motion.div  
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white shadow-xl rounded-xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-teal-800">
              Interview Dashboard
            </h1>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handlePractice} 
              className="bg-teal-600 text-white px-6 py-3 rounded-full  
                         hover:bg-teal-700 transition-all"
            >
              Practice Interview
            </motion.button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Scheduled Interviews
            </h2>
            {interviews.length === 0 ? (
              <p className="text-gray-600 text-center">No interviews scheduled</p>
            ) : (
              interviews.map((interview) => (
                <motion.div 
                key={interview.id} 
                whileHover={{ scale: 1.02 }} 
                onClick={() => navigate(`/interview-details/${interview.id}`)}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200"
              >
                  <div className="flex items-center space-x-4">
                    <Calendar className="text-teal-600" />
                    <div>
                      <p className="font-semibold">{interview.title}</p>
                      <p className="text-sm text-gray-600">
                        {interview.scheduledAt.toLocaleString()} | {interview.domain}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;