import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';

const InterviewsOverview = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [interviews, setInterviews] = useState({
    active: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        
        // Fetch active interviews
        const activeResponse = await axiosPrivate.post(
          'http://localhost:8080/interview/Active',
          JSON.stringify(auth),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        console.log(activeResponse);
        // Fetch past interviews
        const pastResponse = await axiosPrivate.post(
          'http://localhost:8080/interview/Past',
          JSON.stringify(auth),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        console.log(pastResponse);
        // Transform backend data to match frontend structure
        setInterviews({
          active: activeResponse.data.map(interview => ({
            id: interview._id,
            title: interview.title,
            domain: interview.domain,
            startDate: new Date(interview.scheduledAt).toISOString().split('T')[0],
            endDate: new Date(interview.deadline).toISOString().split('T')[0],
            applicants: interview.interviewees?.length || 0,
            averageScore: 0, // You'll need to calculate this or get from backend
            status: 'Active'
          })),
          past: pastResponse.data.map(interview => ({
            id: interview._id,
            title: interview.title,
            domain: interview.domain,
            startDate: new Date(interview.scheduledAt).toISOString().split('T')[0],
            endDate: new Date(interview.deadline).toISOString().split('T')[0],
            applicants: interview.interviewees?.length || 0,
            averageScore: 0, // You'll need to calculate this or get from backend
            status: 'Completed'
          }))
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        // setError(error);
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleInterviewClick = (id) => {
    navigate(`/interview/details/${id}`);
  };

  const filteredInterviews = interviews[activeTab].filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading interviews...</div>;
  if (error) return <div>Error loading interviews</div>;


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
        <p className="text-gray-600 mt-2">View and manage all your interviews</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search interviews by title or domain..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'active'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            Active Interviews
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'past'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300'
            }`}
          >
            Past Interviews
          </button>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            onClick={() => handleInterviewClick(interview.id)}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{interview.title}</h3>
                <p className="text-sm text-gray-600">{interview.domain}</p>
              </div>
              
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {interview.applicants} Applicants
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {interview.startDate} - {interview.endDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    interview.status === 'Completed' 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {interview.status}
                  </span>
                </div>

                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewsOverview;