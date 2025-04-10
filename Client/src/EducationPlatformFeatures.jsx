import React from 'react';

const FeatureCard = ({ title, description, colorClass, icon }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg h-full group transition-all duration-300 hover:-translate-y-1 ${colorClass} border border-white/10 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10`}>
      <div className="p-5 h-full flex flex-col">
        {/* Icon with gradient background */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-xl opacity-90 hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
          {icon}
        </div>
        
        {/* Title with improved contrast and readability */}
        <h3 className="text-lg font-extrabold mb-3 text-gray-900 pr-12 leading-tight tracking-tight">
          {title}
        </h3>
        
        {/* Description list with better typography */}
        <ul className="text-gray-700 text-sm space-y-2 pr-8 mt-1">
          {description.map((item, index) => (
            <li key={index} className="flex items-start group/item hover:text-gray-900 transition-colors">
              <span className="mr-2 mt-1 text-gray-900 font-bold">•</span>
              <span className="leading-relaxed font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Enhanced glass effect and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

// Bright Card Background Colors - keeping the same colors
const cardColors = {
  lightGreen: "bg-green-300",
  blue: "bg-blue-300",
  pink: "bg-pink-300",
  orange: "bg-orange-300",
  purple: "bg-purple-300",
  cyan: "bg-cyan-300",
  lime: "bg-lime-300",
  amber: "bg-amber-300",
  red: "bg-red-300",
  teal: "bg-teal-300",
  indigo: "bg-indigo-300",
  fuchsia: "bg-fuchsia-300"
};

// Enhanced SVG Icons with brighter colors
const CourseContentIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="44" height="44" rx="4" fill="#4ADE80" fillOpacity="0.8"/>
    <path d="M20 32H44M20 24H44M20 40H36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M45 15L15 15L15 45L45 45L45 15Z" stroke="#FFFFFF" strokeWidth="2.5"/>
    <circle cx="45" cy="15" r="10" fill="#22C55E" fillOpacity="0.8"/>
    <path d="M45 10V15H50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const AssignmentIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="8" width="40" height="48" rx="4" fill="#60A5FA" fillOpacity="0.8"/>
    <path d="M20 24H44M20 32H44M20 40H36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="18" y="16" width="8" height="2" rx="1" fill="#FFFFFF"/>
    <rect x="18" y="34" width="8" height="2" rx="1" fill="#FFFFFF"/>
    <rect x="18" y="26" width="8" height="2" rx="1" fill="#FFFFFF"/>
  </svg>
);

const ProgressTrackingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="44" height="36" rx="4" fill="#2DD4BF" fillOpacity="0.8"/>
    <path d="M16 42L24 34L32 38L48 22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="24" cy="34" r="3" fill="#FFFFFF"/>
    <circle cx="32" cy="38" r="3" fill="#FFFFFF"/>
    <circle cx="48" cy="22" r="3" fill="#FFFFFF"/>
    <circle cx="16" cy="42" r="3" fill="#FFFFFF"/>
  </svg>
);

const GradingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" fill="#FBBF24" fillOpacity="0.8"/>
    <path d="M24 32L30 38L42 26" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 16V18M46 32H48M32 46V48M16 32H18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SchedulingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="40" height="36" rx="4" fill="#F472B6" fillOpacity="0.8"/>
    <path d="M12 24H52" stroke="#FFFFFF" strokeWidth="2.5"/>
    <rect x="20" y="30" width="6" height="6" rx="1" fill="#FFFFFF"/>
    <rect x="30" y="30" width="6" height="6" rx="1" fill="#FFFFFF"/>
    <rect x="40" y="30" width="6" height="6" rx="1" fill="#FFFFFF"/>
    <rect x="20" y="40" width="6" height="6" rx="1" fill="#FFFFFF"/>
    <rect x="30" y="40" width="6" height="6" rx="1" fill="#FFFFFF"/>
    <path d="M12 12V16H52V12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ChatbotIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="16" width="40" height="30" rx="4" fill="#818CF8" fillOpacity="0.8"/>
    <path d="M12 46L20 38H52" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="24" cy="28" r="2" fill="#FFFFFF"/>
    <circle cx="32" cy="28" r="2" fill="#FFFFFF"/>
    <circle cx="40" cy="28" r="2" fill="#FFFFFF"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="40" rx="4" fill="#60A5FA" fillOpacity="0.8"/>
    <rect x="16" y="36" width="8" height="10" rx="1" fill="#FFFFFF"/>
    <rect x="28" y="28" width="8" height="18" rx="1" fill="#FFFFFF"/>
    <rect x="40" y="20" width="8" height="26" rx="1" fill="#FFFFFF"/>
    <path d="M14 20L24 24L34 18L50 26" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="2" fill="#FFFFFF"/>
    <circle cx="34" cy="18" r="2" fill="#FFFFFF"/>
    <circle cx="50" cy="26" r="2" fill="#FFFFFF"/>
    <circle cx="14" cy="20" r="2" fill="#FFFFFF"/>
  </svg>
);

const StudentTrackingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="44" height="30" rx="4" fill="#C084FC" fillOpacity="0.8"/>
    <circle cx="32" cy="16" r="8" fill="#A855F7" fillOpacity="0.8"/>
    <path d="M24 30H40M24 38H36M24 46H32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const PersonalizedLearningIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 16H54V48H10V16Z" fill="#A3E635" fillOpacity="0.8" rx="4"/>
    <path d="M22 32L32 22L42 32L32 42L22 32Z" fill="#84CC16" fillOpacity="0.8"/>
    <path d="M26 32L32 26L38 32L32 38L26 32Z" fill="white"/>
    <path d="M16 24H24M40 24H48M16 40H24M40 40H48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const AnalyticsDashboardIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="40" rx="4" fill="#FB923C" fillOpacity="0.8"/>
    <path d="M14 22C14 20.8954 14.8954 20 16 20H48C49.1046 20 50 20.8954 50 22V26H14V22Z" fill="#F97316" fillOpacity="0.8"/>
    <rect x="14" y="30" width="16" height="18" rx="2" fill="#F97316" fillOpacity="0.8"/>
    <rect x="34" y="30" width="16" height="8" rx="2" fill="#F97316" fillOpacity="0.8"/>
    <rect x="34" y="42" width="16" height="6" rx="2" fill="#F97316" fillOpacity="0.8"/>
    <circle cx="18" cy="23" r="1" fill="white"/>
    <circle cx="22" cy="23" r="1" fill="white"/>
    <circle cx="26" cy="23" r="1" fill="white"/>
  </svg>
);

const CodeRepositoryIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="44" height="44" rx="4" fill="#22D3EE" fillOpacity="0.8"/>
    <path d="M22 20L28 26M36 34L42 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M42 20L36 26M28 34L22 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="32" cy="32" r="4" stroke="#FFFFFF" strokeWidth="2.5"/>
  </svg>
);

const DiscussionForumIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12H42V38H26L18 46V38H10V12Z" fill="#F87171" fillOpacity="0.8"/>
    <path d="M22 38V42L30 34H54V12H42" stroke="#FFFFFF" strokeWidth="2.5"/>
    <path d="M18 22H34M18 30H28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const EducationPlatformFeatures = () => {
  // Updated feature data with descriptions from the image
  const features = [
    {
      title: "Course Content Creation",
      description: [
        "Faculty can upload syllabus, textbook references, or course outline",
        "AI identifies key topics and structures content into chapters",
        "Faculty can set number of chapters with deadlines"
      ],
      colorClass: cardColors.lightGreen,
      icon: <CourseContentIcon />
    },
    {
      title: "Assignment & Assessment Generation",
      description: [
        "AI generates MCQs, quizzes, written tasks, and file submissions",
        "Supports various formats (PDF, images, documents)",
        "Faculty can review and modify before publishing"
      ],
      colorClass: cardColors.blue,
      icon: <AssignmentIcon />
    },
    {
      title: "Student Progress Tracking",
      description: [
        "Tracks course deadlines and monitors each student's progress",
        "AI provides personalized feedback based on performance",
        "Faculty can access student engagement insights"
      ],
      colorClass: cardColors.teal,
      icon: <ProgressTrackingIcon />
    },
    {
      title: "Automated Grading",
      description: [
        "Evaluates performance on quizzes, coding problems, and submissions",
        "Automatically calculates final grades",
        "Faculty can adjust grades before releasing them"
      ],
      colorClass: cardColors.amber,
      icon: <GradingIcon />
    },
    {
      title: "Smart Scheduling",
      description: [
        "Automates lecture scheduling based on faculty availability",
        "Avoids schedule overlaps and generates optimized timetable",
        "Integrates with Google Calendar and sends notifications"
      ],
      colorClass: cardColors.pink,
      icon: <SchedulingIcon />
    },
    {
      title: "AI-Powered Doubt Resolution",
      description: [
        "Chatbot analyzes queries and provides immediate answers",
        "Summarizes repetitive doubts into refined questions",
        "Forwards complex queries to faculty when needed"
      ],
      colorClass: cardColors.blue,
      icon: <ChatbotIcon />
    },
    {
      title: "Course-Wide Performance Analysis",
      description: [
        "Generates graphs comparing students to class average",
        "Shows trends in performance across assignments and tests",
        "Processes student scores from all course activities"
      ],
      colorClass: cardColors.lime,
      icon: <AnalyticsIcon />
    },
    {
      title: "Individual Student Tracking",
      description: [
        "Detailed chapter-by-chapter performance graphs",
        "Automatically flags students below performance threshold",
        "Suggests intervention strategies for struggling students"
      ],
      colorClass: cardColors.purple,
      icon: <StudentTrackingIcon />
    },
    {
      title: "Personalized Learning Paths",
      description: [
        "Identifies weak areas based on lowest-scoring topics",
        "Generates simplified content for struggling students",
        "Creates extra exercises to reinforce learning"
      ],
      colorClass: "bg-gradient-to-br from-green-200 to-green-300", // Changed from cardColors.green
      icon: <PersonalizedLearningIcon />
    },
    {
      title: "Advanced Analytics Dashboard",
      description: [
        "Chapter difficulty analysis with failure rates",
        "Engagement vs. performance correlation graphs",
        "Time spent vs. scores and submission trend analysis"
      ],
      colorClass: cardColors.orange,
      icon: <AnalyticsDashboardIcon />
    },
    {
      title: "Code Repository Integration",
      description: [
        "Students can link GitHub repositories for submissions",
        "Faculty can browse commit history and track contributions",
        "Direct feedback and grading through the system"
      ],
      colorClass: cardColors.cyan,
      icon: <CodeRepositoryIcon />
    },
    {
      title: "Student Discussion Forum",
      description: [
        "Dedicated chat section for real-time collaboration",
        "Threaded discussions with faculty tagging",
        "Upvoting system for helpful answers to foster peer learning"
      ],
      colorClass: cardColors.red,
      icon: <DiscussionForumIcon />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      {/* Subtle animated background */}
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden">
        <div className="absolute -inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10 z-0"></div>
        <div className="absolute top-0 right-0 bg-blue-500/5 w-72 h-72 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 bg-purple-500/5 w-72 h-72 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* More compact header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-4">
            Education Platform Features
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A comprehensive AI-powered learning management system
          </p>
        </div>
        
        {/* Tighter grid with smaller gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              colorClass={feature.colorClass}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationPlatformFeatures;