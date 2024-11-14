import axios from '../api/axios';

export const interviewService = {
  async getNextQuestion(lastAnswer, role, conversationHistory) {
    try {
      const response = await axios.post('http://localhost:8080/api/get-next-question', {
        lastAnswer,
        role,
        questionHistory: conversationHistory.map(item => item.question)
      });
      return response.data.question; // Make sure to return just the question string
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get next question');
    }
  },

  async saveTranscript(conversationData) {
    try {
      const response = await axios.post('http://localhost:8080/api/save-transcript', {
        conversation: conversationData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to save transcript');
    }
  }
};