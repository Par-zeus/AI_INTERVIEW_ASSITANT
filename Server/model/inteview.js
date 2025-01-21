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
    question: String,
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

