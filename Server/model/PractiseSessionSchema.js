const mongoose = require('mongoose');

const PracticeSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who started the session
    domain: { type: String, required: true }, // e.g., "Frontend Development"
    startedAt: { type: Date, default: Date.now }, // Start time of the session
    endedAt: { type: Date }, // End time of the session
    duration: { type: Number }, // Duration of the session (in minutes)
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PracticeQuestion' }], // Questions in the session
    totalScore: { type: Number, default: 0 }, // Total score from AI evaluation
    feedback: { type: String }, // AI-generated feedback
    transcriptUrl: { type: String }, // URL for the session transcript (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model('PracticeSession', PracticeSessionSchema);
