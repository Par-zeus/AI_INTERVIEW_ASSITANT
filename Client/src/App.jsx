// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/pages/Layout';
import LandingPage from './components/pages/LandingPage';
import UserProfile from './components/pages/UserProfile';
import RoleSelection from './components/pages/RoleSelection';
import InterviewModeSelection from './components/pages/Interview Conduction/InterviewModeSelection';
import OralInterview from './components/pages/Interview Conduction/OralInterview';
import TranscriptAnalysis from './components/pages/Interview Conduction/TranscriptAnalysis';
import Login from './components/SignIn/Login';
import SignUp from './components/SignIn/SignUp';
import Settings from './components/pages/Settings';
import Progress from './components/pages/Progress';
import InterviewPage from './components/pages/Interview Conduction/InterviewPage'; 

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/mode/:role" element={<InterviewModeSelection />} />
          <Route path="/interview/:mode/:role" element={<OralInterview />} />
          <Route path="/transcript" element={<TranscriptAnalysis />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
