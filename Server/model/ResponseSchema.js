const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }, // For real interviews
    practiceSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeSession' }, // For practice
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to either Interview or Practice Question
    answerText: { type: String, required: true },
    videoUrl: { type: String }, // For video interviews
    semanticScore: { type: Number }, // AI evaluation
    analysis: {
      grammarScore: { type: Number },
      coherenceScore: { type: Number },
      relevanceScore: { type: Number },
      videoAnalysis: {
        facialConfidence: { type: Number }, // ML analysis of facial expressions
        gestureConfidence: { type: Number }, // ML analysis of gestures
        speechClarity: { type: Number }, // ML analysis of speech in video
        overallScore: { type: Number }, // Combined score from video analysis
      },
    },
    transcript: { type: String }, // Generated transcript of the response (if applicable)
    submittedAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model('Response', ResponseSchema);
