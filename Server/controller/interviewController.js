const Interview = require('../model/inteview');
const User =require('../model/user');
const path = require('path');
const fs = require('fs').promises;
// const { interviewQuestions } = require('../data/questions');
// const { analyzeAnswer } = require('../utils/analyzer');

const saveTranscript = async (req, res)=> {
    try {
      // console.log(req.body);
      const {conversation,email} = req.body;
      const user=await User.findOne({email:email})
      const transcript = conversation.map(entry => 
        `Q: ${entry.question}\nA: ${entry.answer}\n`
      ).join('\n');
      
      const transcriptsDir = path.join(__dirname, '../transcripts');
      await fs.mkdir(transcriptsDir, { recursive: true });
  
      // Always append to the same file
      const filePath = path.join(transcriptsDir, 'interview_transcript.txt');
      
      // Add timestamp and separator before new entries
      const timestampedTranscript = `\n--- Interview Session ${new Date().toISOString()} ---\n${transcript}`;
      
      await fs.appendFile(filePath, timestampedTranscript, 'utf8');
      
      console.log(user);
      const interview = new Interview({
        role: conversation[0]?.role || 'general',
        conversation: conversation.map(entry => ({
          question: entry.question,
          answer: entry.answer
        })),
        userId:user._id
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