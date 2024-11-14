const Interview = require('../models/Interview');
const { interviewQuestions } = require('../data/questions');
const { analyzeAnswer } = require('../utils/analyzer');

const saveTranscript = async (req, res)=> {
    try {
      const conversation = req.body;
      
      const interview = new Interview({
        role: conversation[0]?.role || 'general',
        conversation: conversation.map(entry => ({
          question: entry.question,
          answer: entry.answer
        }))
      });

      await interview.save();

      res.status(200).json({
        success: true,
        interviewId: interview._id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving interview:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}

 const getNextQuestion= async (req, res)=> {
    try {
      const { lastAnswer, role, questionHistory } = req.body;
      
      // If this is the first question or no last answer
      if (!lastAnswer || questionHistory.length === 0) {
        const initialQuestion = getRandomInitialQuestion(role);
        return res.json({
          success: true,
          question: initialQuestion,
          metadata: { type: 'initial' }
        });
      }

      // Analyze answer and get follow-up
      const analysis = analyzeAnswer(lastAnswer);
      const nextQuestion = getFollowUpQuestion(analysis, questionHistory);

      res.json({
        success: true,
        question: nextQuestion,
        metadata: {
          category: analysis.category,
          subcategory: analysis.subcategory,
          type: 'follow_up'
        }
      });
    } catch (error) {
      console.error('Error getting next question:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }


module.exports = {saveTranscript ,getNextQuestion};