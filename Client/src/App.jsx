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
import InterviewerDashboard from './components/pages/Interviewer/InterviewerDashboard';
import InterviewScheduling from './components/pages/Interviewer/InterviewScheduling';
import InterviewDetails from './components/pages/Interviewer/InterviewDetails';
import InterviewsOverview from './components/pages/Interviewer/InterviewsOverview';
import VideoInterview from './components/pages/Interview Conduction/videoInterview';
import Dashboard from './components/pages/Dashboard';
import ProfileCompletion from './components/pages/UserProfile';
import InterviewInfo from './components/pages/Interview Conduction/InterviewInfo';
import CommonDashboard from './components/pages/CommonDashboard';
import ProductUseCases from './ProductUseCases';
import InnovativeShoppingPlatform from './InnovativeShoppingPlatform';
import TechStack from './TechStack';
import EducationPlatformFeatures from './EducationPlatformFeatures';
import Flowchart from './FlowchartNode';

const Roles={
  'User':2001,
  'Admin':5150
}
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path='/unauthorized' element={<Unauthorized/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route element={<PersistLogin/>}> */}
              {/* <Route element={<RequireAuth allowedRoles={["Interviewer","Interviewee"]}/>}> */}
                  <Route path="/user-profile" element={<ProfileCompletion />} />
                  <Route path="/commonDashboard" element={<CommonDashboard />} />
                  <Route path="/role-selection" element={<RoleSelection />} />
                  <Route path="/interview" element={<InterviewPage />} />
                  <Route path="/interview/:role" element={<InterviewModeSelection />} />
                  <Route path="/interview/:role/video" element={<VideoInterview />} />
                  <Route path="/interview/:role/ai-oral" element={<OralInterview />} />
                  <Route path="/transcript" element={<TranscriptAnalysis />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path='/dashboard1' element={<Dashboard/>} />
                  <Route path="/dashboard" element={<InterviewerDashboard />} />
                  <Route path="/ScheduleInterview" element={<InterviewScheduling />} />
                  <Route path="/InterviewOverview" element={<InterviewsOverview />} />
                  {/* <Route  path="/interview/details/:interviewId" element={<InterviewDetails />} /> */}
                  <Route  path="/interview/details/:interviewId" element={<InterviewDetails />} />
                  <Route path='/interview-details/:interviewId' element={<InterviewInfo/>} />
                  
              {/* </Route> */}
          {/* </Route> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
