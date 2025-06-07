import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Mic, 
  Award, 
  TrendingUp, 
  Users, 
  Briefcase, 
  BookOpen,
  Lock,
  ArrowRight,
  Sparkles,
  Play,
  Star
} from 'lucide-react';

const CommonDashboard = ({ auth }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "AI-Powered Interviews",
      description: "Practice with our advanced AI interviewer for realistic interview scenarios",
      icon: <Video className="text-indigo-400" size={24} />,
      locked: !auth,
      color: "from-violet-500 to-indigo-500"
    },
    {
      title: "Voice Analysis",
      description: "Get feedback on your speaking pace, clarity, and confidence",
      icon: <Mic className="text-indigo-400" size={24} />,
      locked: !auth,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Performance Tracking",
      description: "Track your progress and identify areas for improvement",
      icon: <TrendingUp className="text-indigo-400" size={24} />,
      locked: !auth,
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Interview Library",
      description: "Access a vast library of industry-specific interview questions",
      icon: <BookOpen className="text-indigo-400" size={24} />,
      locked: !auth,
      color: "from-blue-400 to-indigo-500"
    },
    {
      title: "Mock Interviews",
      description: "Practice with real-world interview scenarios",
      icon: <Users className="text-indigo-400" size={24} />,
      locked: !auth,
      color: "from-indigo-400 to-purple-500"
    },
    {
      title: "Career Resources",
      description: "Access guides, tips, and industry insights",
      icon: <Briefcase className="text-indigo-400" size={24} />,
      locked: false,
      color: "from-purple-400 to-indigo-500"
    }
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Practice Interviews",
      icon: <Video className="text-indigo-300" size={20} />
    },
    {
      value: "95%",
      label: "Success Rate",
      icon: <Award className="text-indigo-300" size={20} />
    },
    {
      value: "50+",
      label: "Industry Scenarios",
      icon: <Briefcase className="text-indigo-300" size={20} />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "This platform transformed my interview performance. I landed my dream job after just 2 weeks of practice.",
      avatar: "S"
    },
    {
      name: "David Chen",
      role: "Marketing Director",
      content: "The AI feedback was incredibly valuable. It pinpointed weaknesses in my responses that I couldn't see myself.",
      avatar: "D"
    }
  ];

  const fadeIn = (delay = 0) => ({
    opacity: isVisible ? 1 : 0, 
    y: isVisible ? 0 : 20,
    transition: { 
      duration: 0.5, 
      delay: delay,
      ease: [0.22, 1, 0.36, 1]
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div 
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          style={fadeIn().animate}
        >
          <div 
            className="inline-block mb-6 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md"
            style={fadeIn(0.1).animate}
          >
            <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">
                Next-gen interview preparation
              </span>
            </div>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
            style={fadeIn(0.2).animate}
          >
            Master Your Interview Skills with AI
          </h1>
          
          <p 
            className="text-xl text-indigo-100 mb-10 max-w-2xl"
            style={fadeIn(0.3).animate}
          >
            Our AI-powered platform provides real-time feedback to help you ace your next interview.
            Practice, analyze, and improve with each session.
          </p>
          
          {!auth && (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-lg font-semibold
                      hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 
                      shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 flex items-center justify-center"
              style={fadeIn(0.4).animate}
            >
              Get Started Now
              <ArrowRight className="ml-2" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Featured Video Section */}
      <div 
        className="bg-indigo-900/30 backdrop-blur-md py-16 border-y border-indigo-800/50"
        style={fadeIn(0.5).animate}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-800/70 rounded-2xl overflow-hidden border border-indigo-700/30">
            <div className="aspect-w-16 aspect-h-9 relative bg-slate-900 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-indigo-600/90 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all group">
                  <Play size={28} className="text-white ml-1" />
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-medium mb-1">See how our AI interview coach works</h3>
                <p className="text-indigo-200 text-sm">Watch a quick demonstration of our platform in action</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200"
          style={fadeIn(0.3).animate}
        >
          Powerful Features to Elevate Your Career
        </h2>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={fadeIn(0.4).animate}
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              style={fadeIn(0.5 + index * 0.05).animate}
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40
                       hover:border-indigo-600/70 transition-all duration-300
                       hover:shadow-lg hover:shadow-indigo-600/10 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.color}"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-900/70 rounded-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold text-indigo-100 mb-2">
                        {feature.title}
                      </h3>
                      {feature.locked && (
                        <Lock size={16} className="text-indigo-400 ml-2" />
                      )}
                    </div>
                    <p className="text-indigo-200/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-indigo-800/30">
                  <button 
                    onClick={() => feature.locked ? navigate('/login') : navigate('/feature')}
                    className="text-indigo-300 hover:text-indigo-200 text-sm font-medium flex items-center"
                  >
                    {feature.locked ? 'Unlock feature' : 'Learn more'}
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div 
        className="bg-gradient-to-b from-indigo-900/40 to-slate-900/60 backdrop-blur-lg py-20 border-t border-indigo-800/30"
        style={fadeIn(0.6).animate}
      >
        <div className="container mx-auto px-6">
          <h2 
            className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200"
          >
            Trusted by Thousands
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl border border-indigo-800/40 text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-indigo-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-slate-800/40 backdrop-blur-md p-6 rounded-xl border border-indigo-800/40"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-indigo-100">{testimonial.name}</h4>
                    <p className="text-indigo-300 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-indigo-100/80 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div 
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-800/50 to-blue-900/50 backdrop-blur-md p-12 rounded-3xl border border-indigo-700/50 text-center"
          style={fadeIn(0.7).animate}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Interview Skills?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Join thousands of professionals who've boosted their career opportunities.</p>
          <button
            onClick={() => navigate(auth ? '/dashboard' : '/login')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-lg font-semibold
                     hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 
                     shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 flex items-center mx-auto justify-center"
          >
            {auth ? 'Go to Dashboard' : 'Get Started Now'}
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonDashboard;