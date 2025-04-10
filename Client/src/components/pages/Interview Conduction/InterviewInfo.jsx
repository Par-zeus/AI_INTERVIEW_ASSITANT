import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Users,
  BookOpen,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { axiosPrivate } from '../../../api/axios';

const InterviewInfo = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axiosPrivate.get(`http://localhost:8080/interview/${interviewId}`);
        console.log(response);
        setInterview(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch interview details');
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interviewId]);

  const handleStartInterview = () => {
    if (interview) {
      navigate(`/interview/${interview.domain.toLowerCase()}/${interview.type.toLowerCase()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading interview details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!interview) return null;

  const isActive = new Date() >= new Date(interview.scheduledAt) && 
                  new Date() <= new Date(interview.deadline);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-teal-800">
                {interview.title}
              </h1>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled For</p>
                    <p className="font-medium">
                      {new Date(interview.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{interview.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Domain</p>
                    <p className="font-medium">{interview.domain}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PlayCircle className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-500">Interview Type</p>
                    <p className="font-medium">{interview.type}</p>
                  </div>
                </div>
              </div>

              {interview.description && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{interview.description}</p>
                </div>
              )}

              <div className="pt-6">
                <button
                  onClick={handleStartInterview}
                  disabled={!isActive}
                  className={`w-full py-4 rounded-lg text-white text-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-teal-600 hover:bg-teal-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isActive ? 'Start Interview' : 'Interview Not Active Yet'}
                </button>
                {!isActive && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    This interview will become active at the scheduled time.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewInfo;