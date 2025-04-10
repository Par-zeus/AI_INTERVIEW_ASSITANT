import React from 'react';
import { 
  GraduationCap, Video, MessagesSquare, Users, 
  FileText, Sparkles, ScrollText, Code, 
  Trophy, Award ,Brain,Target
} from 'lucide-react';

const Card = ({ children, className, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={`px-5 pb-5 ${className}`}>
    {children}
  </div>
);

const UseCaseCard = ({ icon: Icon, title, description, gradient, iconColor }) => (
  <Card gradient={gradient} className="w-full h-full">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${iconColor} bg-opacity-30 backdrop-blur-sm`}>
          <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
      </div>
      <CardTitle className="mt-3">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-white/90">{description}</p>
    </CardContent>
  </Card>
);

const ProductUseCases = () => {
    const useCases = [
      {
        icon: GraduationCap,
        title: "Adaptive Learning for Students",
        description: "A student struggling with a subject gets AI-recommended courses, smart flashcards, and quizzes tailored to their progress.",
        gradient: "from-blue-500 to-violet-600",
        iconColor: "bg-white"
      },
      {
        icon: MessagesSquare,
        title: "Job Interview Preparation",
        description: "A graduate preparing for placements takes AI-powered mock interviews with real-time emotion analysis and feedback.",
        gradient: "from-green-500 to-teal-600",
        iconColor: "bg-white"
      },
      {
        icon: FileText,
        title: "Internship & Career Assistance",
        description: "A student searches for internships based on location, stipend, and duration and applies directly through the dashboard.",
        gradient: "from-purple-500 to-indigo-600",
        iconColor: "bg-white"
      },
      {
        icon: Video,
        title: "Virtual Classrooms & Live Training",
        description: "A university integrates the LMS with Zoom/Google Meet for live classes, with automated attendance tracking and recorded sessions for absentees.",
        gradient: "from-red-500 to-pink-600",
        iconColor: "bg-white"
      },
      {
        icon: Sparkles,
        title: " Instant Doubt Resolution",
        description: "A learner struggling with a coding concept asks the AI chatbot, which provides step-by-step explanations in a personalized way.",
        gradient: "from-cyan-500 to-blue-600",
        iconColor: "bg-white"
      },
      {
        icon: Users,
        title: " AI-Powered Mentorship",
        description: "A mentor is assigned to students based on skills and interests, using AI-driven scheduling and progress tracking to provide structured guidance.",
        gradient: "from-amber-500 to-orange-600",
        iconColor: "bg-white"
      },
      {
        icon: ScrollText,
        title: " Resume Building & Career Readiness",
        description: "A student creates a resume using AI that highlights their strengths and suggests improvements based on industry trends.",
        gradient: "from-emerald-500 to-green-600",
        iconColor: "bg-white"
      },
      {
        icon: Code,
        title: " Collaborative Coding & Peer Learning",
        description: "A group of students work on a coding project together in a real-time collaborative coding environment with AI-powered suggestions.",
        gradient: "from-violet-500 to-purple-600",
        iconColor: "bg-white"
      },
      {
        icon: Trophy,
        title: " Gamified Learning for Motivation",
        description: "A student earns badges, points, and leaderboard rankings for completing assignments and engaging in discussions.",
        gradient: "from-yellow-500 to-amber-600",
        iconColor: "bg-white"
      },
      {
        icon: Award,
        title: " Certification & Skill Validation",
        description: "A learner completes an AI-generated course and receives a certification that can be added to their resume and LinkedIn.",
        gradient: "from-pink-500 to-rose-600",
        iconColor: "bg-white"
      },
      {
        icon: Brain,
        title: " Personalized Learning Pathways",
        description: "A student receives AI-customized learning paths based on their career goals, learning style, and industry demand, with dynamic adjustments as they progress.",
        gradient: "from-indigo-500 to-blue-600",
        iconColor: "bg-white"
      },
      {
        icon: Target,
        title: " Skill Gap Analysis & Industry Alignment",
        description: "An organization uses AI to analyze emerging industry trends and automatically updates course content to address skill gaps between student capabilities and market demands.",
        gradient: "from-purple-500 to-pink-600",
        iconColor: "bg-white"
      }
    ];

  return (
    <div className="container mx-auto p-8 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Use Cases for AI-Powered LMS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => (
          <UseCaseCard key={index} {...useCase} />
        ))}
      </div>
    </div>
  );
};

export default ProductUseCases;