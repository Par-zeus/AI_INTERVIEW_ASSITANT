const mongoose = require('mongoose');

const ActualQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    domain: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    answers: { type: [String], required: true }, // Array of answers
    // type: { type: String, enum: ["Open-ended", "MCQ"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActualQuestion', ActualQuestionSchema);
