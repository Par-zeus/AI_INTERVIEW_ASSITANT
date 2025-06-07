const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  userAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer', required: true },
  mockInterviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockInterview', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  analysis: {
    grammarScore: { type: Number },
    coherenceScore: { type: Number },
    relevanceScore: { type: Number },
    videoAnalysis: {
      // facialConfidence: { type: Number },
      // gestureConfidence: { type: Number },
      Confidence: { type: Number },
      // speechClarity: { type: Number },
      overallScore: { type: Number },
    },
    transcriptAnalysis: {
      speakingSkills: { type: Number },
      confidence: { type: Number },
      fluency: { type: Number },
      correctness: { type: Number },
      overallScore: { type: Number },
      feedback: [String]
    }
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
