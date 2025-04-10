import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosPrivate } from '../../../api/axios';
import { Download, FileText, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';

const InterviewDetails = () => {
  const { interviewId } = useParams();
  const location = useLocation();
  const [interviewData, setInterviewData] = useState({
    title: '',
    domain: '',
    totalCandidates: 0,
    averageScore: 0,
    candidates: []
  });
  const [interviewDetails, setInterviewDetails] = useState({
    title: location.state?.title || '',
    domain: location.state?.domain || '',
    interviewId: interviewId
  });
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedProfile, setExpandedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axiosPrivate.get(`http://localhost:8080/interview/details/${interviewId}`, {
            headers: {
            'Content-Type': 'application/json',
          },
            withCredentials:true
        });
        console.log(response);
        setInterviewDetails(prevDetails => ({
          ...prevDetails,
          ...response.data
        }));
        setLoading(false);
      } catch (err) {
        console.log(error);
        // setError(err.response?.data?.message || 'Failed to fetch interview details');
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interviewId]);

  const handleDownloadResume = async (candidateId) => {
    try {
      const response = await axios.get(`/api/candidates/${candidateId}/resume`, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${candidateId}_resume.pdf`;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const handleDownloadTranscript = async (candidateId) => {
    try {
      const response = await axios.get(`/api/interviews/${interviewId}/transcript/${candidateId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${candidateId}_transcript.pdf`;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const sortedCandidates = [...interviewData.candidates].sort((a, b) => {
    return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
  });

  if (loading) return <div>Loading interview details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Interview Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{interviewDetails.title}</h1>
        <p className="text-gray-600 mt-2">Domain: {interviewDetails.domain}</p>
        <div className="mt-4 flex gap-4">
          <div className="bg-teal-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-teal-600">Total Candidates</p>
            <p className="text-xl font-semibold text-teal-700">{interviewDetails.totalCandidates}</p>
          </div>
          <div className="bg-teal-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-teal-600">Average Score</p>
            <p className="text-xl font-semibold text-teal-700">{interviewDetails.averageScore}%</p>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center">
          <div className="flex-1">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              Rank by Score
              {sortOrder === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Candidates */}
        <div className="divide-y divide-gray-200">
          {sortedCandidates.map((candidate, index) => (
            <div key={candidate.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="font-semibold text-gray-900">{candidate.score}%</p>
                  </div>
                  <button
                    onClick={() => handleDownloadResume(candidate.id)}
                    className="p-2 text-gray-600 hover:text-teal-600"
                    title="Download Resume"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownloadTranscript(candidate.id)}
                    className="p-2 text-gray-600 hover:text-teal-600"
                    title="Download Transcript"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setExpandedProfile(expandedProfile === candidate.id ? null : candidate.id)}
                    className="text-teal-600 text-sm font-medium"
                  >
                    {expandedProfile === candidate.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Profile */}
              {expandedProfile === candidate.id && (
                <div className="mt-4 ml-12 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Interview Details</h4>
                      <p className="text-sm text-gray-600 mt-1">Date: {candidate.interviewDate}</p>
                      <p className="text-sm text-gray-600">Duration: {candidate.duration}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Feedback</h4>
                      <p className="text-sm text-gray-600 mt-1">{candidate.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;