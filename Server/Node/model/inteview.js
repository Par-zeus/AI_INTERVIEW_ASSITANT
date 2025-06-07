const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  },
  conversation: [{
    question: {
      text: {
        type: String,
        required: true
      },
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PracticeQuestion',
        required: false  // Make it optional
      }
    },
    answer: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);

