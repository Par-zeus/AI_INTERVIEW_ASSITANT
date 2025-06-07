import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  Search,
  Star,
  ChevronLeft
} from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setIsVisible(true);
    // Get recommended roles from localStorage
    const recommendedRoles = JSON.parse(localStorage.getItem('recommendedRoles') || '[]');
    
    // Map recommended roles to the full role objects with icons and descriptions
    const roleMapping = {
      // Software Development Roles
      'Software Engineer': {
        icon: '💻',
        description: 'Technical interviews focusing on coding, system design, and problem-solving',
        category: 'Software Development'
      },
      'Backend Developer': {
        icon: '⚙️',
        description: 'Backend architecture, APIs, and database design',
        category: 'Software Development'
      },
      'Frontend Developer': {
        icon: '🎨',
        description: 'Frontend development, UI frameworks, and web performance',
        category: 'Software Development'
      },
      'Full Stack Developer': {
        icon: '🌐',
        description: 'Full stack development, architecture, and web technologies',
        category: 'Software Development'
      },
      'Game Developer': {
        icon: '🎮',
        description: 'Game development, graphics programming, and game engines',
        category: 'Software Development'
      },
    
      // Data & AI Roles
      'Data Scientist': {
        icon: '📊',
        description: 'Questions on statistics, machine learning, and data analysis',
        category: 'Data & AI'
      },
      'ML Engineer': {
        icon: '🤖',
        description: 'Machine learning systems, model deployment, and MLOps',
        category: 'Data & AI'
      },
      'AI Researcher': {
        icon: '🧠',
        description: 'Advanced AI concepts, research methodologies, and paper implementations',
        category: 'Data & AI'
      },
      'Data Analyst': {
        icon: '📈',
        description: 'Data analysis, visualization, and business insights',
        category: 'Data & AI'
      },
      'Data Engineer': {
        icon: '🔧',
        description: 'Data pipeline development, ETL processes, and data infrastructure',
        category: 'Data & AI'
      },
      'Database Administrator': {
        icon: '🗄️',
        description: 'Database management, optimization, and maintenance',
        category: 'Data & AI'
      },
    
      // DevOps & Cloud Roles
      'Cloud Engineer': {
        icon: '☁️',
        description: 'Cloud infrastructure, services, and cloud-native applications',
        category: 'DevOps & Cloud'
      },
      'DevOps Engineer': {
        icon: '🔄',
        description: 'CI/CD pipelines, infrastructure as code, and automation',
        category: 'DevOps & Cloud'
      },
    
      // Product & Design Roles
      'Product Manager': {
        icon: '📱',
        description: 'Product strategy, user experience, and business cases',
        category: 'Product & Design'
      },
      'Scrum Master': {
        icon: '📋',
        description: 'Agile methodologies, team facilitation, and process improvement',
        category: 'Product & Design'
      },
      'UX Designer': {
        icon: '🎨',
        description: 'Design thinking, user research, and portfolio discussion',
        category: 'Product & Design'
      },
    
      // Security Roles
      'Cybersecurity Engineer': {
        icon: '🔒',
        description: 'Security assessments, threat detection, and security protocols',
        category: 'Security'
      },
    
      // Blockchain Roles
      'Blockchain Developer': {
        icon: '⛓️',
        description: 'Blockchain protocols, smart contracts, and decentralized applications',
        category: 'Blockchain'
      },
    
      // Management Roles
      'Manager': {
        icon: '👥',
        description: 'Team management, leadership, and organizational skills',
        category: 'Management'
      },
      'Team Lead': {
        icon: '👤',
        description: 'Technical leadership, mentoring, and project coordination',
        category: 'Management'
      },
    
      // General
      'General Software Engineer': {
        icon: '💻',
        description: 'General software development skills and programming fundamentals',
        category: 'Software Development'
      }
    };
    
    // If we have recommended roles, map them, otherwise use all roles
    let mappedRoles = [];
    if (recommendedRoles && recommendedRoles.length > 0) {
      mappedRoles = recommendedRoles.map(role => ({
        title: role,
        icon: roleMapping[role]?.icon || '👔',
        description: roleMapping[role]?.description || 'Role-specific technical and behavioral interviews',
        category: roleMapping[role]?.category || 'Other',
        isRecommended: true
      }));
    } else {
      // Use all roles if no recommendations
      mappedRoles = Object.keys(roleMapping).map(role => ({
        title: role,
        icon: roleMapping[role].icon,
        description: roleMapping[role].description,
        category: roleMapping[role].category,
        isRecommended: false
      }));
    }

    setAvailableRoles(mappedRoles);
  }, []);

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate(`/interview/role/${role}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const categories = ['All', ...new Set(availableRoles.map(role => role.category))];
  
  const filteredRoles = availableRoles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Animation utility function
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white pb-16">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-indigo-300 hover:text-indigo-100 transition-colors mb-8"
          style={fadeIn(0.1).animate}
        >
          <ChevronLeft size={20} />
          <span className="ml-1">Back</span>
        </button>

        {/* Header */}
        <div 
          className="text-center mb-10 lg:mb-16"
          style={fadeIn(0.2).animate}
        >
          <div className="inline-block mb-6 p-2 bg-indigo-900/50 rounded-full backdrop-blur-md">
            <div className="flex items-center space-x-2 px-4 py-1 bg-indigo-600/80 rounded-full">
              <Star size={16} className="text-indigo-200" />
              <span className="text-sm font-medium text-indigo-100">
                Match your skills to ideal roles
              </span>
            </div>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
          >
            Choose Your Interview Path
          </h2>
          
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Select a role that aligns with your skills and career goals for tailored interview practice
          </p>
        </div>

        {/* Search and filter */}
        <div 
          className="max-w-4xl mx-auto mb-10"
          style={fadeIn(0.3).animate}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={20} />
              <input
                type="text"
                placeholder="Search roles or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-slate-800/70 border border-indigo-700/50 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           text-white placeholder-indigo-300 backdrop-blur-md"
              />
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/60 text-indigo-300 hover:bg-slate-700/70'
                } border border-indigo-700/50`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Roles grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          style={fadeIn(0.4).animate}
        >
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role, index) => (
              <div
                key={role.title}
                onClick={() => handleRoleSelect(role.title)}
                style={{
                  ...fadeIn(0.4 + index * 0.05).animate,
                  animationDelay: `${index * 50}ms`
                }}
                className="bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-indigo-800/40
                          hover:border-indigo-600/70 transition-all duration-300 cursor-pointer
                          hover:shadow-lg hover:shadow-indigo-600/10 group relative overflow-hidden"
              >
                {role.isRecommended && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-indigo-900/70 px-2 py-1 rounded-md">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-yellow-100">Recommended</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-4xl mr-4 bg-indigo-900/50 p-3 rounded-xl">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-indigo-100 mb-2 group-hover:text-white transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-indigo-200/80 text-sm">{role.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs font-medium px-3 py-1 bg-indigo-900/50 rounded-full text-indigo-300">
                        {role.category}
                      </span>
                      <ArrowRight size={18} className="text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-indigo-300 text-lg">No roles match your search. Try different keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;