import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const { setAuthInfo, persist, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease, transform 0.6s ease`,
    transitionDelay: `${delay}s`
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axiosPrivate.post(
        '/login',
        JSON.stringify({ identity: email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      
      const email1 = response?.data?.email;
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userName = response?.data?.username;
      const _id = response?.data?._id;
      
      setAuthInfo({ accessToken }, email1, roles, userName, _id);
      setEmail('');
      setPwd('');
      
      if (roles === "Interviewer") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center px-4">
      <div 
        className="w-full max-w-md bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40 shadow-2xl overflow-hidden"
        style={fadeIn(0.1)}
      >
        <div className="p-8">
          {errMsg && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-center">
              <p className="text-red-300 font-medium">
                {errMsg}
              </p>
            </div>
          )}
          
          <h2 
            className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
            style={fadeIn(0.2)}
          >
            Welcome Back
          </h2>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div style={fadeIn(0.3)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  autoComplete="off"
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div style={fadeIn(0.4)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-indigo-400 hover:text-indigo-200 transition-colors" size={18} />
                  ) : (
                    <Eye className="text-indigo-400 hover:text-indigo-200 transition-colors" size={18} />
                  )}
                </button>
              </div>
            </div>
            
            <div 
              className="flex items-center"
              style={fadeIn(0.5)}
            >
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
                className="w-4 h-4 bg-slate-900 border-indigo-500 rounded focus:ring-indigo-500 focus:ring-2 text-indigo-600"
              />
              <label htmlFor="persist" className="ml-2 text-sm text-indigo-200">
                Remember me
              </label>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 disabled:opacity-70 disabled:cursor-not-allowed"
              style={fadeIn(0.6)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>
          
          <p 
            className="mt-6 text-center text-indigo-200"
            style={fadeIn(0.7)}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;