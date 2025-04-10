import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Mic, 
  Award, 
  TrendingUp, 
  Users, 
  Briefcase, 
  BookOpen,
  Lock
} from 'lucide-react';

const CommonDashboard = ({ auth }) => {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI-Powered Interviews",
      description: "Practice with our advanced AI interviewer for realistic interview scenarios",
      icon: <Video className="text-teal-600" size={32} />,
      locked: !auth
    },
    {
      title: "Voice Analysis",
      description: "Get feedback on your speaking pace, clarity, and confidence",
      icon: <Mic className="text-teal-600" size={32} />,
      locked: !auth
    },
    {
      title: "Performance Tracking",
      description: "Track your progress and identify areas for improvement",
      icon: <TrendingUp className="text-teal-600" size={32} />,
      locked: !auth
    },
    {
      title: "Interview Library",
      description: "Access a vast library of industry-specific interview questions",
      icon: <BookOpen className="text-teal-600" size={32} />,
      locked: !auth
    },
    {
      title: "Mock Interviews",
      description: "Practice with real-world interview scenarios",
      icon: <Users className="text-teal-600" size={32} />,
      locked: !auth
    },
    {
      title: "Career Resources",
      description: "Access guides, tips, and industry insights",
      icon: <Briefcase className="text-teal-600" size={32} />,
      locked: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Prepare for Your Next Interview with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master your interview skills with our AI-powered platform. Get real-time feedback and improve your chances of success.
          </p>
          {!auth && (
            <button
              onClick={() => navigate('/login')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg
                        font-semibold transition-colors duration-300"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow
                         border border-gray-100 relative"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-6">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
              {feature.locked && (
                <div className="absolute top-4 right-4">
                  <Lock size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="text-3xl font-bold text-teal-600 mb-2">10,000+</div>
              <div className="text-gray-600">Practice Interviews Conducted</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
              <div className="text-gray-600">User Success Rate</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-teal-600 mb-2">50+</div>
              <div className="text-gray-600">Industry-Specific Scenarios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonDashboard;