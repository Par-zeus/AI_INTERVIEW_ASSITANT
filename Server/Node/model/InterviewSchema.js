const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    domain: { type: String, required: true }, // E.g., "Frontend Development"
    type: { type: String, enum: [ "AI-Oral", "Video"], required: true }, // Added "Video"
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    manualQuestions:[{type:String}],
    aiQuestionCount:{type:Number},
    deadline: { 
      type: Date, 
      default: null 
    },
    description:{
      type:String
    },
    interviewees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSchema", InterviewSchema);
