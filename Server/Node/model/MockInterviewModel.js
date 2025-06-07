const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  jsonMockResp: { type: String, required: true },
  jobPosition: { type: String, required: true },
  jobDesc: { type: String, required: true },
  jobExperience: { type: String, required: true },
  videoAnalysis: {
    confidence: { type: Number },
    emotionBreakdown: { type: Map, of: Number },  // ✅ flexible dynamic keys
    mostCommonEmotion: { type: String },
    message: { type: String },
    overallScore: { type: Number },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
