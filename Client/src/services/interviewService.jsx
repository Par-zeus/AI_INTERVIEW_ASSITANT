import axios from '../api/axios';

export const interviewService = {
  async getNextQuestion(lastAnswer, role, conversationHistory) {
    try {
      const response = await axios.post('/api/get-next-question', {
        lastAnswer,
        role,
        questionHistory: conversationHistory.map(item => item.question)
      });
      return response.data.question; // Make sure to return just the question string
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get next question');
    }
  },

  async saveTranscript({conversationData,email}) {
    if (!Array.isArray(conversationData) || conversationData.length === 0) {
      throw new Error('Invalid conversation data');
    }
    try {
      const response = await axios.post('/interview/save-transcript', {
        conversation: conversationData,
        email:email,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to save transcript');
    }
  }
};