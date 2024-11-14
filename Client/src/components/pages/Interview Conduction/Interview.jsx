// src/pages/Interview.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import OralInterview from './OralInterview';
// import VideoInterview from './VideoInterview';
// import SimpleInterview from './SimpleInterview';

const Interview = () => {
  const { mode, role } = useParams();

  const renderInterviewMode = () => {
    switch (mode) {
      case 'oral':
        return <OralInterview role={role} />;
    //   case 'video':
    //     return <VideoInterview role={role} />;
    //   case 'simple':
    //     return <SimpleInterview role={role} />;
      default:
        return <div>Select a valid interview mode.</div>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Interview Preparation</h2>
      {renderInterviewMode()}
    </div>
  );
};

export default Interview;
