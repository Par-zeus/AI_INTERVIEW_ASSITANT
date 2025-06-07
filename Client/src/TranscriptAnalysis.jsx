import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiChartBar, HiLightningBolt } from 'react-icons/hi';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import evaluateTranscript from './evaluateTranscript'; // Import the new analysis function

const TranscriptAnalysis = () => {
  const [responses, setResponses] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem('interviewResponses') || '[]');
    setResponses(savedResponses);

    const analyzeResponses = async () => {
      const analysisData = await evaluateTranscript(savedResponses);
      setAnalysis(analysisData);
    };

    analyzeResponses();
  }, []);

  const handleDownload = () => {
    const transcriptData = `
      Overall Performance: ${analysis?.overallScore}%

      Metrics:
      Speaking Skills: ${analysis?.metrics.speakingSkills.toFixed(2)}%
      Confidence: ${analysis?.metrics.confidence.toFixed(2)}%
      Fluency: ${analysis?.metrics.fluency.toFixed(2)}%
      Correctness: ${analysis?.metrics.correctness.toFixed(2)}%

      Feedback:
      ${analysis?.feedback.join('\n')}

      Response Transcript:
      ${responses.map((response, index) => `
      Q${index + 1}: ${response.question}
      A${index + 1}: ${response.answer}
      `).join('\n')}
    `;
    const blob = new Blob([transcriptData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Transcript_Analysis.txt';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-teal-800">Interview Analysis</h2>
              <button onClick={handleDownload} className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200">
                <HiDownload className="text-xl" />
                <span>Download PDF</span>
              </button>
            </div>
            <div className="text-center p-6 bg-teal-50 rounded-lg mb-6">
              <div className="text-5xl font-bold text-teal-800 mb-2">{analysis?.overallScore}%</div>
              <div className="text-teal-600">Overall Performance</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analysis?.metrics && Object.entries(analysis.metrics).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-800">{(value * 10).toFixed(0)}%</div>
                  <div className="text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">Key Feedback</h3>
            <div className="space-y-3">
              {analysis?.feedback.map((feedback, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <HiLightningBolt className="text-teal-600 text-xl flex-shrink-0 mt-1" />
                  <span>{feedback}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-teal-800 mb-4">Response Transcript</h3>
            <div className="space-y-6">
              {responses.map((response, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-semibold text-teal-800">Question {index + 1}</div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2">Q: {response.question}</div>
                    <div>A: {response.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TranscriptAnalysis;