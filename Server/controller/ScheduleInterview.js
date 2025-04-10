const Interview = require('../model/InterviewSchema');
const User1 =require('../model/user');
// Create Interview
const createInterview = async (req, res) => {
  try {
    // console.log(req.body);

    const {
      title,
      domain,
      type,
      duration,
      manualQuestions,
      description,
      deadline,
      aiQuestionCount,
    } = req.body.formData;

    if (!["Chat", "AI-Oral", "Video"].includes(type)) {
      return res.status(400).json({ message: "Invalid interview type" });
    }

    // Fetch the user by email
    const user = await User1.findOne({ email: req.body.auth.auth.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the interview
    const newInterview = new Interview({
      interviewerId: user._id, // Use the user's ObjectId here
      title,
      domain,
      deadline,
      type,
      scheduledAt: Date.now(), // Ensure the date format is correct
      duration,
      manualQuestions,
      aiQuestionCount,
      description,
    });

    await newInterview.save();
    res.status(201).json({ message: "Interview scheduled successfully", newInterview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error scheduling interview", error });
  }
};
const getInterviewById = async (req, res) => {
  try {
    
      const interview = await Interview.findById(req.params.interviewId)
          .populate('interviewerId', 'username email');

      if (!interview) {
          return res.status(404).json({ message: 'Interview not found' });
      }

      // // Check if the current user is authorized to view this interview
      // if (!interview.interviewees.includes(req.user._id)) {
      //     return res.status(403).json({ message: 'Not authorized to view this interview' });
      // }

      res.status(200).json(interview);
  } catch (error) {
      console.error('Error fetching interview details:', error);
      res.status(500).json({ message: 'Failed to fetch interview details' });
  }
};
const getInterviewDetails = async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    // Fetch interview with detailed candidate information
    const interview = await Interview.findById(interviewId)
      .populate({
        path: 'interviewees',
        select: 'name email profile' // Select specific user fields
      });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Prepare candidates with detailed information
    const candidates = await Promise.all(interview.interviewees.map(async (candidate) => {
      // Fetch additional candidate-specific interview data 
      // You might need to create a separate model for interview results
      const candidateResults = await InterviewResult.findOne({
        interview: interviewId,
        candidate: candidate._id
      });

      return {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        score: candidateResults ? candidateResults.score : null,
        feedback: candidateResults ? candidateResults.feedback : '',
        interviewDate: interview.scheduledAt,
        duration: `${interview.duration} minutes`
      };
    }));

    res.json({
      title: interview.title,
      domain: interview.domain,
      totalCandidates: candidates.length,
      averageScore: candidates.length 
        ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length)
        : 0,
      candidates
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview details', error: error.message });
  }
};
// Get All Interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching interviews", error });
  }
};

// In your interview controller
const getScheduledInterviews = async (req, res) => {
  // console.log(req.body);
  try {
    const now = new Date();
    const user=await User1.findOne({email:req.body.auth.email});
    // console.log(user);
    const interviews = await Interview.find({ 
      deadline: { $gt: now },
      interviewerId: user._id 
    }).sort({ deadline: 1 });
    console.log(interviews);
    res.status(200).json(interviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching scheduled interviews", error });
  }
};
const getPastInterviews = async (req, res) => {
  try {
    const now = new Date();
    const user=await User1.findOne({email:req.body.auth.email});
    // console.log(user);
    const pastInterviews = await Interview.find({ 
      deadline: { $lt: now },
      interviewerId: user._id 
    }).populate({
      path: 'interviewees',
      select: 'name email'
    }).sort({ deadline: -1 })
    .limit(50);
    
    const formattedInterviews = pastInterviews.map(interview => ({
      _id: interview._id,
      title: interview.title,
      domain: interview.domain,
      type: interview.type,
      scheduledAt: interview.scheduledAt,
      deadline: interview.deadline,
      interviewees: interview.interviewees.length,
      description: interview.description
    }));

    res.status(200).json(formattedInterviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching scheduled interviews", error });
  }
};

const getInterviewStats = async (req, res) => {
  try {
    const totalCandidates = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: 'Completed' });
    const passedInterviews = await Interview.countDocuments({ status: 'Passed' });
    
    const passRate = totalCandidates > 0 
      ? Math.round((passedInterviews / totalCandidates) * 100) 
      : 0;

    res.status(200).json({
      totalCandidates,
      completedInterviews,
      passRate
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching interview stats", error });
  }
};
module.exports={createInterview,getAllInterviews,getInterviewById,getScheduledInterviews,getInterviewStats,getInterviewDetails,getPastInterviews};