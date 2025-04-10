import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ArrowRight
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
    setResumeUrl('');
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
      console.log(response);
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
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8 flex items-center justify-center">
        <div className="text-teal-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-800">
              {isEditing ? 'Edit Your Profile' : 'Your Profile'}
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors"
            >
              {isEditing ? (
                <>
                  <X size={20} /> Cancel
                </>
              ) : (
                <>
                  <Edit2 size={20} /> Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <User className="inline mr-2 text-teal-600" size={20} /> 
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your full name"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Mail className="inline mr-2 text-teal-600" size={20} /> 
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <Phone className="inline mr-2 text-teal-600" size={20} /> 
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your phone number"
                  required
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Linkedin className="inline mr-2 text-teal-600" size={20} /> 
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="LinkedIn profile URL"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Briefcase className="inline mr-2 text-teal-600" size={20} /> 
                Professional Experience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                placeholder="Describe your professional experience"
                required
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Award className="inline mr-2 text-teal-600" size={20} /> 
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                placeholder="Tell us about your educational background"
                required
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                placeholder="List your professional skills"
                required
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <FileText className="inline mr-2 text-teal-600" size={20} /> 
                Resume
              </label>
              {resumeUrl && !formData.resume ? (
                <div className="flex items-center gap-4">
                  <a 
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 underline"
                  >
                    View Current Resume
                  </a>
                  {isEditing && (
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required={!resumeUrl}
                  disabled={!isEditing}
                />
              )}
            </div>

            <div className="flex gap-4">
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-teal-600 text-white p-3 rounded-lg 
                           hover:bg-teal-700 transition-all"
                >
                  Save Changes
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleContinue}
                disabled={processing || !resumeUrl}
                className="flex-1 bg-teal-600 text-white p-3 rounded-lg 
                         hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
              >
                Continue to Role Selection
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCompletion;