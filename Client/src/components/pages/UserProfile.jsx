import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';

const UserProfile = () => {
  const navigate = useNavigate();
  const axiosPrivate=useAxiosPrivate();
  const {auth} =useAuth();
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
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      console.log(formData);
      const finalFormData ={
        ...formData
      }
      const response = await axiosPrivate.put(`/users/${auth.email}`, finalFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      // Store recommended roles in localStorage
      localStorage.setItem('recommendedRoles', JSON.stringify(response.data.recommendedRoles));
      
      // Navigate to role selection
      navigate('/role-selection');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-teal-800 mb-8">Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              // required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              // required
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              // required
            />
            <InputField
              label="LinkedIn Profile"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <TextArea
              label="Professional Experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              // required
            />
            <TextArea
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              // required
            />
            <TextArea
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              // required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              // required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold
                     hover:bg-teal-700 transition-colors duration-200"
          >
            Continue to Role Selection
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

export default UserProfile;