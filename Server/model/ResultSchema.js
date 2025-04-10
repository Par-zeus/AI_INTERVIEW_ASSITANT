const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }, // For real interviews
    practiceSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PracticeSession' }, // For practice
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalScore: { type: Number, required: true },
    feedback: { type: String, required: true }, // AI-generated feedback
    transcriptUrl: { type: String } // Transcript location
  },
  { timestamps: true }
);

module.exports = mongoose.model('Result', ResultSchema);
