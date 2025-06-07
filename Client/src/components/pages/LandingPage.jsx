import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Bot, 
  BarChart, 
  CheckCircle, 
  Star, 
  TrendingUp,
  ArrowRight,
  Users,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    const isLoggedIn = true; // Replace with actual auth check
    navigate(isLoggedIn ? '/dashboard1' : '/login');
  };

  const features = [
    {
      icon: <Target className="text-indigo-500" size={36} />,
      title: "Personalized Preparation",
      description: "Tailored interview practice based on your unique skills and career goals."
    },
    {
      icon: <Bot className="text-indigo-500" size={36} />,
      title: "AI-Powered Insights",
      description: "Intelligent analysis of your interview performance with actionable feedback."
    },
    {
      icon: <BarChart className="text-indigo-500" size={36} />,
      title: "Comprehensive Analytics",
      description: "Detailed reports tracking your progress and improvement areas."
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer",
      content: "This platform helped me land my dream job. The personalized feedback was invaluable.",
      avatar: "A"
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "The AI-powered coaching gave me confidence I never had in previous interviews.",
      avatar: "S"
    }
  ];

  const stats = [
    { number: "93%", label: "Success Rate" },
    { number: "250+", label: "Companies" },
    { number: "10K+", label: "Users" }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div 
            className="inline-block mb-6 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md"
            style={fadeIn().animate}
          >
            <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
              <Sparkles size={16} className="text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">
                Next-gen interview preparation
              </span>
            </div>
          </div>
          
          <h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
            style={fadeIn(0.1).animate}
          >
            Master Interviews With AI
          </h1>
          
          <p 
            className="text-xl text-indigo-100 mb-10 max-w-2xl"
            style={fadeIn(0.2).animate}
          >
            Elevate your interview skills with personalized AI coaching. 
            Practice, learn, and confidently showcase your potential.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4"
            style={fadeIn(0.3).animate}
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-lg font-semibold
                       hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 
                       shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2" size={18} />
            </button>
            
            <button className="px-8 py-4 bg-indigo-900/40 backdrop-blur-sm border border-indigo-700/50 rounded-full text-lg font-medium
                       hover:bg-indigo-800/50 transition-all duration-300 flex items-center justify-center">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-indigo-900/30 backdrop-blur-lg py-12 border-y border-indigo-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center"
                style={fadeIn(0.3 + index * 0.1).animate}
              >
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300">
                  {stat.number}
                </p>
                <p className="text-indigo-200 font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200"
          style={fadeIn(0.3).animate}
        >
          Powerful Features to Elevate Your Career
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              style={fadeIn(0.4 + index * 0.1).animate}
              className="bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10"
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-900/70 rounded-xl mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-indigo-100 mb-3">{feature.title}</h3>
              <p className="text-indigo-200/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/60 backdrop-blur-lg py-24 border-t border-indigo-800/30">
        <div className="container mx-auto px-6">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-200"
            style={fadeIn(0.3).animate}
          >
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                style={fadeIn(0.4 + index * 0.1).animate}
                className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-indigo-800/40"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-indigo-100">{testimonial.name}</h4>
                    <p className="text-indigo-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-indigo-100/80 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-6 py-24">
        <div 
          className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-800/50 to-blue-900/50 backdrop-blur-md p-12 rounded-3xl border border-indigo-700/50 text-center"
          style={fadeIn(0.5).animate}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Interview Skills?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Join thousands of professionals who've boosted their career opportunities.</p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full text-lg font-semibold
                     hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 
                     shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 flex items-center mx-auto justify-center"
          >
            Get Started Now
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </div>

     
    </div>
  );
};

export default LandingPage;