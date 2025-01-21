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
import Unauthorized from './components/SignIn/Unauthorized';
import RequireAuth from './components/SignIn/RequireAuth';
import PersistLogin from './components/SignIn/PersistLogin';

const Roles={
  'User':2001,
  'Admin':5150
}
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/unauthorized' element={<Unauthorized/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route element={<PersistLogin/>}>
              <Route element={<RequireAuth allowedRoles={[Roles.User,Roles.Admin]}/>}>
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/role-selection" element={<RoleSelection />} />
                  <Route path="/interview" element={<InterviewPage />} />
                  <Route path="/interview/mode/:role" element={<InterviewModeSelection />} />
                  <Route path="/interview/:mode/:role" element={<OralInterview />} />
                  <Route path="/transcript" element={<TranscriptAnalysis />} />
                  <Route path="/progress" element={<Progress />} />
              </Route>
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
