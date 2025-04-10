import React, { useState } from 'react';

const FlowchartNode = ({ 
  text, 
  color = 'blue', 
  type = 'rectangle', 
  width = 'w-48', 
  height = 'h-auto', 
  children 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const colorVariants = {
    pink: {
      bg: 'bg-pink-100 border-pink-300 text-pink-800',
      hover: 'hover:bg-pink-200'
    },
    purple: {
      bg: 'bg-purple-100 border-purple-300 text-purple-800',
      hover: 'hover:bg-purple-200'
    },
    green: {
      bg: 'bg-green-100 border-green-300 text-green-800',
      hover: 'hover:bg-green-200'
    },
    blue: {
      bg: 'bg-blue-100 border-blue-300 text-blue-800',
      hover: 'hover:bg-blue-200'
    },
    teal: {
      bg: 'bg-teal-100 border-teal-300 text-teal-800',
      hover: 'hover:bg-teal-200'
    },
    yellow: {
      bg: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      hover: 'hover:bg-yellow-200'
    }
  };

  const nodeShapes = {
    rectangle: 'rounded-lg',
    diamond: 'transform rotate-45 rounded-sm',
    diamondText: 'transform -rotate-45'
  };

  return (
    <div 
      className={`
        ${colorVariants[color].bg} 
        ${colorVariants[color].hover}
        ${width} ${height}
        ${type === 'rectangle' ? 'rounded-lg' : 'transform rotate-45'}
        border-2 p-2 m-1 
        shadow-md transition-all duration-300 
        flex items-center justify-center
        text-center text-xs
      `}
    >
      <span className={type === 'diamond' ? 'transform -rotate-45' : ''}>
        {text}
      </span>
      
      {children && isExpanded && (
        <div className="mt-2 flex flex-col items-center space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

const NoteBox = ({ text }) => (
  <div className="bg-yellow-100 border-2 border-yellow-300 p-2 m-1 rounded-lg text-xs text-center shadow-md">
    {text}
  </div>
);

const Flowchart = () => {
  return (
    <div className="p-4 bg-white min-h-screen overflow-x-auto">
      <div className="text-2xl font-bold text-center mb-6">Course Development Workflow</div>
      
      <div className="flex flex-col items-center space-y-4">
        {/* First Section - Initial Exploration */}
        <div className="flex space-x-4">
          <FlowchartNode text="Ask Faculty" color="pink" type="rectangle" />
          <FlowchartNode text="Ask AI Chatbot" color="pink" type="rectangle" />
        </div>

        <FlowchartNode text="Need Identified" color="pink" type="diamond" />

        <div className="flex space-x-4">
          <FlowchartNode text="Gather initial requirements" color="pink" type="rectangle" />
          <FlowchartNode text="Check existing content" color="pink" type="rectangle" />
        </div>

        <FlowchartNode text="Preliminary Scope" color="purple" type="diamond" />

        <div className="flex space-x-4">
          <FlowchartNode text="Validate Scope" color="purple" type="rectangle" />
          <FlowchartNode text="Welcome Page" color="purple" type="rectangle" />
          <FlowchartNode text="Identify Learning Objectives" color="purple" type="rectangle" />
        </div>

        <FlowchartNode text="Start" color="green" type="rectangle" />

        {/* Development Section */}
        <div className="flex space-x-4">
          <FlowchartNode text="Go to Cloudcrate" color="blue" type="rectangle" />
          <FlowchartNode text="Course Content Development" color="blue" type="rectangle">
            <NoteBox text="Course Notes:&#10;- Number of course hours&#10;- Target audience&#10;- Language for specific topics" />
          </FlowchartNode>
        </div>

        {/* Additional Processes */}
        <div className="flex space-x-4">
          <FlowchartNode text="View Overall Performance" color="teal" type="rectangle" />
          <FlowchartNode text="Development for AI" color="teal" type="rectangle" />
        </div>
      </div>
    </div>
  );
};

export default Flowchart;