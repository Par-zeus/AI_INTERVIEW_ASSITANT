import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Linkedin, 
  FileText, 
  Award,
  Edit2,
  X,
  ArrowRight,
  Check,
  Upload,
  Shield,
  Sparkles,
  Eye
} from 'lucide-react';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: auth.email,
    phone: '',
    experience: '',
    education: '',
    skills: '',
    resume: null,
    linkedIn: ''
  });

  const [resumeUrl, setResumeUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [completion, setCompletion] = useState(0);

  // Calculate profile completion percentage
  useEffect(() => {
    let completed = 0;
    const totalFields = 7; // Total number of fields excluding email (which is pre-filled)
    
    if (formData.fullName) completed++;
    if (formData.phone) completed++;
    if (formData.experience) completed++;
    if (formData.education) completed++;
    if (formData.skills) completed++;
    if (formData.linkedIn) completed++;
    if (resumeUrl || formData.resume) completed++;
    
    setCompletion(Math.round((completed / totalFields) * 100));
  }, [formData, resumeUrl]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${auth.email}`);
        const userData = response.data;
        
        setFormData({
          fullName: userData.fullName || '',
          email: auth.email,
          phone: userData.phone || '',
          experience: userData.experience || '',
          education: userData.education || '',
          skills: userData.skills || '',
          resume: null,
          linkedIn: userData.linkedIn || ''
        });

        if (userData.resume) {
          setResumeUrl(userData.resume);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth.email, axiosPrivate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'resume' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'resume') {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      const response = await axiosPrivate.put(`/users/${auth.email}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.resume) {
        setResumeUrl(response.data.resume);
      }

      if (response.data.recommendedRoles) {
        localStorage.setItem('recommendedRoles', JSON.stringify(response.data.recommendedRoles));
      }

      setIsEditing(false);
      navigate('/role-selection');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleContinue = async () => {
    setProcessing(true);
    try {
      // Get role recommendations based on existing resume
      const response = await axiosPrivate.post(`/users/${auth.email}/analyze-resume`);
      if (response.data.recommendedRoles) {
        localStorage.setItem('recommendedRoles', JSON.stringify(response.data.recommendedRoles));
      }

      navigate('/role-selection');
    } catch (error) {
      console.error('Error getting role recommendations:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-indigo-300 text-xl flex items-center gap-3">
          <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-300"></span>
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-slate-800 to-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Profile header with completion status */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-indigo-800/30 backdrop-blur-lg rounded-2xl p-6 border border-indigo-700/50 text-white">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">
              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-blue-300">
                {formData.fullName || 'Your Profile'}
              </h1>
              <p className="text-indigo-300">{auth.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-48 h-3 bg-indigo-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-indigo-200 font-semibold">{completion}%</span>
            </div>
            <p className="text-sm text-indigo-300">Profile Completion</p>
          </div>
        </div>

        {/* Main profile card */}
        <div className="relative bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-indigo-800/40 shadow-xl shadow-indigo-900/20 overflow-hidden">
          {/* Sparkle decoration */}
          <div className="absolute top-6 right-6">
            <Sparkles className="text-indigo-400/30" size={28} />
          </div>
          
          {/* Header with edit button */}
          <div className="flex justify-between items-center p-8 border-b border-indigo-800/30">
            <h2 className="text-2xl font-bold text-indigo-100">
              {isEditing ? 'Edit Your Profile' : 'Your Professional Profile'}
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-900/60 text-indigo-200 hover:bg-indigo-700/70 transition-colors border border-indigo-700/50"
            >
              {isEditing ? (
                <>
                  <X size={18} /> Cancel
                </>
              ) : (
                <>
                  <Edit2 size={18} /> Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8 text-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-200 font-medium">
                  <User className="text-indigo-400" size={18} /> 
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                  placeholder="Enter your full name"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-200 font-medium">
                  <Mail className="text-indigo-400" size={18} /> 
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-3 bg-slate-700/30 border border-indigo-700/30 rounded-xl focus:outline-none text-indigo-300"
                  disabled
                />
                <p className="text-xs text-indigo-400/70 flex items-center gap-1 mt-1">
                  <Shield size={12} /> Email verification required
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-200 font-medium">
                  <Phone className="text-indigo-400" size={18} /> 
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                  placeholder="Enter your phone number"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-indigo-200 font-medium">
                  <Linkedin className="text-indigo-400" size={18} /> 
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                  placeholder="LinkedIn profile URL"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-200 font-medium">
                <Briefcase className="text-indigo-400" size={18} /> 
                Professional Experience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-4 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                rows={4}
                placeholder="Describe your professional experience, including your current role and previous positions"
                required
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-200 font-medium">
                <Award className="text-indigo-400" size={18} /> 
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full p-4 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                rows={4}
                placeholder="Tell us about your educational background, degrees, certifications, and institutions"
                required
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-200 font-medium">
                <Sparkles className="text-indigo-400" size={18} /> 
                Skills
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full p-4 bg-slate-700/60 border border-indigo-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-100 placeholder-indigo-300/50"
                rows={4}
                placeholder="List your key professional skills and competencies, separated by commas"
                required
                disabled={!isEditing}
              />
              <p className="text-xs text-indigo-400/70 mt-1">
                Pro tip: Include both technical and soft skills relevant to your target roles
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-indigo-200 font-medium">
                <FileText className="text-indigo-400" size={18} /> 
                Resume
              </label>
              
              {resumeUrl && !formData.resume ? (
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/30 rounded-lg">
                      <FileText className="text-blue-300" size={24} />
                    </div>
                    <div>
                      <p className="text-indigo-200 font-medium">Current Resume</p>
                      <p className="text-xs text-indigo-300">
                        Uploaded resume will be used for job recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 ml-auto">
                    <a 
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-100 rounded-lg transition-colors text-sm flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </a>
                    {isEditing && (
                      <label className="cursor-pointer px-3 py-2 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-100 rounded-lg transition-colors text-sm flex items-center gap-1">
                        <Upload size={16} /> Replace
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`border-2 border-dashed rounded-xl p-8 text-center ${isEditing ? 'border-indigo-600/50 bg-indigo-900/20' : 'border-indigo-800/30 bg-slate-800/50'}`}>
                  {formData.resume ? (
                    <div className="flex flex-col items-center">
                      <Check size={36} className="text-green-400 mb-2" />
                      <p className="text-indigo-200 font-medium">{formData.resume.name}</p>
                      <p className="text-sm text-indigo-300 mt-1">
                        {Math.round(formData.resume.size / 1024)} KB · Ready to upload
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-indigo-400 mb-3" size={32} />
                      <p className="text-indigo-200 font-medium">Upload your resume</p>
                      <p className="text-sm text-indigo-300 mt-1">
                        Supported formats: PDF, DOC, DOCX
                      </p>
                      {isEditing && (
                        <label className="cursor-pointer inline-block mt-4 px-4 py-2 bg-indigo-600/60 hover:bg-indigo-600/80 text-indigo-100 rounded-lg transition-colors">
                          Browse Files
                          <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            required={!resumeUrl}
                          />
                        </label>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-indigo-800/30">
              {isEditing && (
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white p-4 rounded-xl 
                         transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 font-medium"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check size={20} /> Save Changes
                    </>
                  )}
                </button>
              )}
              
              <button
                type="button"
                onClick={handleContinue}
                disabled={processing || !resumeUrl}
                className={`flex-1 ${!resumeUrl ? 'bg-indigo-800/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} text-white p-4 rounded-xl 
                        transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 font-medium`}
              >
                {processing ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Role Selection
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Additional info card */}
        <div className="mt-8 bg-indigo-800/30 backdrop-blur-lg rounded-xl p-6 border border-indigo-700/50 text-indigo-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-600/40 rounded-lg">
              <Shield className="text-indigo-300" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-indigo-200">Privacy Information</h3>
          </div>
          <p className="text-sm text-indigo-300">
            Your profile information is used to match you with appropriate job roles and provide personalized interview preparation. 
            We never share your data with third parties without your explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;