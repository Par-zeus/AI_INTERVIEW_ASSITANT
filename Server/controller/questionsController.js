const PracticeQuestion = require('../model/PractiseQuestionSchema'); // Import model

// 🎯 Function to Get Next Question
const getNextQuestion = async (req, res) => {
    try {
      const { lastAnswer, role, questionHistory = [] } = req.body;
  
      if (!role) {
        return res.status(400).json({ success: false, error: "Role is required." });
      }
  
      // Only query database for questions that have valid ObjectIds
      const validQuestionIds = questionHistory.filter(q => {
        try {
          return mongoose.Types.ObjectId.isValid(q);
        } catch (e) {
          return false;
        }
      });
  
      const difficultyLevels = ["Easy", "Easy", "Easy", "Medium", "Medium", "Hard"];
      const randomDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
  
      const questions = await PracticeQuestion.find({
        domain: role,
        difficulty: randomDifficulty,
        ...(validQuestionIds.length > 0 && { _id: { $nin: validQuestionIds } })
      });
  
      if (questions.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "No more unique questions available",
          question: { questionText: "What makes you the best candidate for this position?" }
        });
      }
  
      const question = questions[Math.floor(Math.random() * questions.length)];
  
      return res.json({
        success: true,
        question: {
          questionText: question.questionText,
          _id: question._id
        },
        metadata: {
          role,
          difficulty: randomDifficulty,
        }
      });
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ success: false, error: "Failed to generate interview question" });
    }
  };
module.exports ={getNextQuestion}
