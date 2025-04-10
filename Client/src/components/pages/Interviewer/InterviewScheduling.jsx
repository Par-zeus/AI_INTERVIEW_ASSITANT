import React, { useState } from 'react';
import { Calendar, Clock, Book, MessageSquare, Plus, Trash2 ,Video} from 'lucide-react';
import { Bot } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { axiosPrivate } from '../../../api/axios';
const InterviewScheduling = () => {
  const auth=useAuth();
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    type: '',
    duration: 30,
    deadline: '',
    scheduledAt: '',
    description: '',
    questionSource: 'both',
    manualQuestions: [''],
    aiQuestionCount: 5
  });

  const domains = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design'
  ];

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {

      const response = await axiosPrivate.post(`http://localhost:8080/interview/scheduled`,
        JSON.stringify({formData,auth}),
        {
          headers: {
          'Content-Type': 'application/json',
        },
          withCredentials:true
      },
        
      );
      console.log(response);
      // navigate("/login");
    } catch(err) {
      console.log(err);
    }
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.manualQuestions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      manualQuestions: newQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      manualQuestions: [...prev.manualQuestions, '']
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      manualQuestions: prev.manualQuestions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Schedule New Interview</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Previous form fields remain unchanged until the Interview Type section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Interview Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., Senior Frontend Developer Position"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">Select Domain</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Interview Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="AI-Oral"
                  checked={formData.type === 'AI-Oral'}
                  onChange={handleChange}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="flex items-center">
                  <Bot size={18} className="mr-1" />
                  AI Interview
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="Chat"
                  checked={formData.type === 'Chat'}
                  onChange={handleChange}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="flex items-center">
                  <MessageSquare size={18} className="mr-1" />
                  Chat Based
                </span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="Video"
                  checked={formData.type === 'Video'}
                  onChange={handleChange}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="flex items-center">
                  <Video size={18} className="mr-1" />
                  Video Interview
                </span>
              </label>
            </div>
          </div>

          {/* Question Source Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Question Source</label>
            <select
              name="questionSource"
              value={formData.questionSource}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="ai">AI Generated Only</option>
              <option value="manual">Manual Questions Only</option>
              <option value="both">Both AI and Manual Questions</option>
            </select>
          </div>

          {/* Manual Questions Section */}
          {(formData.questionSource === 'manual' || formData.questionSource === 'both') && (
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 block">Manual Questions</label>
              {formData.manualQuestions.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your question"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
              >
                <Plus size={20} />
                Add Question
              </button>
            </div>
          )}

          {/* AI Question Count */}
          {(formData.questionSource === 'ai' || formData.questionSource === 'both') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Number of AI Questions</label>
              <input
                type="number"
                name="aiQuestionCount"
                value={formData.aiQuestionCount}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Duration (minutes)</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Application Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Add any additional information or requirements..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200"
            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduling;