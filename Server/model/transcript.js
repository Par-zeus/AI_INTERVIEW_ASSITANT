const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  transcriptFile: {
    type: String,
    required: true
  },
  userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  },
  interviewId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transcript', transcriptSchema);

