// src/pages/InterviewDashboard.jsx
import { useState } from 'react';
import { analyzeTranscript } from '../services/analysisService';
import AudioRecorder from '../AudioRecorder';
import ResultsDisplay from '../ResultsDisplay';

const InterviewDashboard = () => {
    const [transcript, setTranscript] = useState(null);
    const [scores, setScores] = useState({});

    const handleRecordComplete = (data) => {
        // Simulate saving and processing the transcript
        setTranscript(data);
        const analysisResults = analyzeTranscript(data);
        setScores(analysisResults);
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-semibold text-teal-600 mb-6">Interview Dashboard</h2>

            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <p className="text-lg text-gray-700">Question: Describe your previous experience in AI projects.</p>
                <AudioRecorder onRecordComplete={handleRecordComplete} />
            </div>

            <div className="mt-8 w-full max-w-md space-y-4">
                {transcript && <ResultsDisplay scores={scores} />}
            </div>
        </div>
    );
};

export default InterviewDashboard;
