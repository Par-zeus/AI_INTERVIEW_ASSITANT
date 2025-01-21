const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  FeedbackFile: {
    type: String,
    required: true
  },
  userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  },
  transcriptId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transcript',
    required: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transcript', transcriptSchema);

