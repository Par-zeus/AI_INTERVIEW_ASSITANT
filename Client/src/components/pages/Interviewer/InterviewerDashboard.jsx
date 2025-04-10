import React, { useState,useEffect } from 'react';
import { Calendar, Clock, Users, FileText, CheckSquare, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
const InterviewerDashboard = () => {
  // const axiosPrivate=useAxiosPrivate();
  const navigate = useNavigate();
  const auth=useAuth();
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    completedInterviews: 0,
    passRate: 0,
    avgInterviewDuration: 0
  });
  const handleSchedule =()=>{
    navigate("/ScheduleInterview");
  }

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const interviewsResponse = await axiosPrivate.post(`http://localhost:8080/interview/Active`,
          JSON.stringify(auth),
          {
                headers: {
                'Content-Type': 'application/json',
              },
                withCredentials:true
            },
              
            );
            const statsResponse = await axiosPrivate.get(`http://localhost:8080/interview/stats`,
              {
                headers: {
                'Content-Type': 'application/json',
              },
                withCredentials:true
            },
              
            );
     
        

        console.log(interviewsResponse);
        console.log(statsResponse);
        // Filter upcoming interviews (where deadline is not over)
        const now = new Date();
        const upcoming = interviewsResponse.data
          .filter(interview => new Date(interview.deadline) > now)
          .slice(0, 2);

        setUpcomingInterviews(upcoming);
        
        // Update stats from response or set default
        setStats({
          totalCandidates: statsResponse.data.totalCandidates || 124,
          completedInterviews: statsResponse.data.completedInterviews || 89,
          passRate: statsResponse.data.passRate || 76,
          avgInterviewDuration: statsResponse.data.avgInterviewDuration || 45
        });
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, []);
  // const [upcomingInterviews] = useState([
  //   { id: 1, candidate: "Alex Johnson", role: "Frontend Developer", date: "2025-01-24", time: "10:00 AM", status: "Scheduled" },
  //   { id: 2, candidate: "Sarah Chen", role: "Data Scientist", date: "2025-01-24", time: "2:00 PM", status: "Scheduled" },
  // ]);

  const [recentResults] = useState([
    { id: 1, candidate: "Mike Brown", role: "Backend Developer", score: 85, status: "Passed" },
    { id: 2, candidate: "Lisa Wong", role: "Product Manager", score: 92, status: "Passed" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Users className="h-8 w-8 text-teal-600" />}
          title="Total Candidates"
          value={stats.totalCandidates.toString()}
          trend="+12% this month"
        />
        <StatsCard
          icon={<CheckSquare className="h-8 w-8 text-teal-600" />}
          title="Completed Interviews"
          value={stats.completedInterviews.toString()}
          trend="+5% this week"
        />
        <StatsCard
          icon={<PieChart className="h-8 w-8 text-teal-600" />}
          title="Pass Rate"
          value={`${stats.passRate}%`}
          trend="+3% vs last month"
        />
        <StatsCard
          icon={<Clock className="h-8 w-8 text-teal-600" />}
          title={`${stats.avgInterviewDuration} mins`}
          value="45 mins"
          trend="-2 mins vs avg"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 text-teal-600" />
              Upcoming Interviews
            </h2>
            <button 
              onClick={() => navigate('/InterviewOverview')}
              className="text-teal-600 hover:text-teal-700 text-sm"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview) => (
                  <div 
                    key={interview._id} 
                    onClick={() => navigate(`/interview/details/${interview._id}`, { 
                      state: { 
                        interviewId: interview._id,
                        title: interview.title,
                        domain: interview.domain
                      } 
                    })}
                     className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.title}</h3>
                      <p className="text-sm text-gray-600">{interview.domain}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(interview.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{interview.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No upcoming interviews</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-teal-600" />
              Recent Results
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-gray-900">{result.candidate}</h3>
                    <p className="text-sm text-gray-600">{result.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{result.score}%</p>
                    <p className={`text-sm ${
                      result.status === 'Passed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.status}
                    </p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-teal-600 hover:text-teal-700 text-sm font-medium">
                View All Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2" onClick={()=>handleSchedule()}>
          <Calendar className="h-5 w-5" />
          Schedule New Interview
        </button>
        <button className="flex-1 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium border border-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Reports
        </button>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        {icon}
        <h3 className="mt-4 text-sm font-medium text-gray-600">{title}</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="text-sm text-green-600">{trend}</div>
    </div>
  </div>
);

export default InterviewerDashboard;