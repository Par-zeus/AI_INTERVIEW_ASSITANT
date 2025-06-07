const Response = require('../model/ResponseSchema');
const UserAnswer = require('../model/UserAnswerModel');

const responseController = {
  async createAnalysis(req, res) {
    try {
      const { userAnswerId, analysis } = req.body;

      // Get the UserAnswer to link with analysis
      const userAnswer = await UserAnswer.findById(userAnswerId);
      if (!userAnswer) {
        return res.status(404).json({ message: 'User answer not found' });
      }

      const response = new Response({
        userAnswerId,
        mockInterviewId: userAnswer.mockIdRef,
        userId: userAnswer.user,
        analysis
      });

      await response.save();
      return res.status(201).json(response);
    } catch (error) {
      console.error('Error creating analysis:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAnalysisByMockId(req, res) {
    try {
      const { mockId } = req.params;
      const analyses = await Response.find({ mockInterviewId: mockId })
        .populate('userAnswerId');
      return res.status(200).json(analyses);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = responseController;
