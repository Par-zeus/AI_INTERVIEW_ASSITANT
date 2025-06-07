import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SignUp = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''  
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease, transform 0.6s ease`,
    transitionDelay: `${delay}s`
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: formData.username, 
            password: formData.password, 
            email: formData.email, 
            role: formData.role
          }),
        });
        
        if (response.ok) {
          navigate("/login");
        } else {
          const data = await response.json();
          if (data.message) {
            setErrors({ form: data.message });
          } else {
            setErrors({ form: "Registration failed. Please try again." });
          }
        }
      } catch(err) {
        console.log(err);
        setErrors({ form: "Connection error. Please try again later." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div 
        className="w-full max-w-md bg-slate-800/60 backdrop-blur-md rounded-2xl border border-indigo-800/40 shadow-2xl overflow-hidden"
        style={fadeIn(0.1)}
      >
        <div className="p-8">
          {errors.form && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-center">
              <p className="text-red-300 font-medium">
                {errors.form}
              </p>
            </div>
          )}
          
          <h2 
            className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200"
            style={fadeIn(0.2)}
          >
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div style={fadeIn(0.3)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div style={fadeIn(0.4)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div style={fadeIn(0.5)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Enter your password"
                  required
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={fadeIn(0.6)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-indigo-700/50 rounded-lg py-3 px-10 text-indigo-100 placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-indigo-400 hover:text-indigo-200 transition-colors" size={18} />
                  ) : (
                    <Eye className="text-indigo-400 hover:text-indigo-200 transition-colors" size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Selection */}
            <div style={fadeIn(0.7)}>
              <label className="block text-indigo-200 mb-2 text-sm font-medium">Role</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="bg-slate-900/30 border border-indigo-700/30 hover:border-indigo-600/70 rounded-lg p-4 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="role"
                    value="interviewer"
                    checked={formData.role === 'interviewer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`flex flex-col items-center justify-center ${formData.role === 'interviewer' ? 'text-blue-400' : 'text-indigo-300'}`}>
                    <div className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${formData.role === 'interviewer' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-700/50 border-indigo-700/50'} border`}>
                      {formData.role === 'interviewer' ? <CheckCircle size={16} /> : null}
                    </div>
                    <span className="text-sm font-medium">Interviewer</span>
                  </div>
                </label>
                
                <label className="bg-slate-900/30 border border-indigo-700/30 hover:border-indigo-600/70 rounded-lg p-4 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="role"
                    value="interviewee"
                    checked={formData.role === 'interviewee'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`flex flex-col items-center justify-center ${formData.role === 'interviewee' ? 'text-blue-400' : 'text-indigo-300'}`}>
                    <div className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${formData.role === 'interviewee' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-700/50 border-indigo-700/50'} border`}>
                      {formData.role === 'interviewee' ? <CheckCircle size={16} /> : null}
                    </div>
                    <span className="text-sm font-medium">Interviewee</span>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 disabled:opacity-70 disabled:cursor-not-allowed"
              style={fadeIn(0.8)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p 
            className="mt-6 text-center text-indigo-200"
            style={fadeIn(0.9)}
          >
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;