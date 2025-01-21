// RoleSelection.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [availableRoles, setAvailableRoles] = useState([]);
  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate(`/interview/mode/${role}`);
  };
  useEffect(() => {
    // Get recommended roles from localStorage
    const recommendedRoles = JSON.parse(localStorage.getItem('recommendedRoles') || '[]');
    console.log(recommendedRoles);
    // Map recommended roles to the full role objects with icons and descriptions
    const roleMapping = {
      'Software Engineer': {
        icon: '💻',
        description: 'Technical interviews focusing on coding, system design, and problem-solving'
      },
      'Data Scientist': {
        icon: '📊',
        description: 'Questions on statistics, machine learning, and data analysis'
      },
      'Product Manager': {
        icon: '📱',
        description: 'Product strategy, user experience, and business cases'
      },
      'UX Designer': {
        icon: '🎨',
        description: 'Design thinking, user research, and portfolio discussion'
      },
      'Full Stack Developer': {
        icon: '🌐',
        description: 'Full stack development, architecture, and web technologies'
      },
      'Frontend Developer': {
        icon: '🎨',
        description: 'Frontend development, UI frameworks, and web performance'
      },
      'Backend Developer': {
        icon: '⚙️',
        description: 'Backend architecture, APIs, and database design'
      },
      'ML Engineer': {
        icon: '🤖',
        description: 'Machine learning systems, model deployment, and MLOps'
      },
      'Data Analyst': {
        icon: '📈',
        description: 'Data analysis, visualization, and business insights'
      }
    };
    
    const mappedRoles = recommendedRoles.map(role => ({
      title: role,
      icon: roleMapping[role]?.icon || '👔',
      description: roleMapping[role]?.description || 'Role-specific technical and behavioral interviews'
    }));

    setAvailableRoles(mappedRoles);
  }, []);

  // Rest of the component remains the same, but use availableRoles instead of the hardcoded roles array
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-teal-800 mb-4">
            Recommended Roles Based on Your Skills
          </h2>
          <p className="text-xl text-gray-600">
            Choose the role you want to practice interviewing for
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleRoleSelect(role.title)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer
                         hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{role.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-teal-800 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600">{role.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;