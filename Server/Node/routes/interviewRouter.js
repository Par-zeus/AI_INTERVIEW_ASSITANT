const express = require('express');
const { chatSession } = require('../config/AiInterview'); // Ensure correct path
const MockInterview = require('../model/MockInterviewModel'); // Ensure correct path to schema
const User = require("../model/user");
const UserAnswer=require('../model/UserAnswerModel')

const router = express.Router();

// POST: Add/Update videoAnalysis by interview _id
router.post('/:id/video-analysis', async (req, res) => {
  try {
    const { id } = req.params;
    const videoAnalysis = req.body;

    const interview = await MockInterview.findByIdAndUpdate(
      id,
      { videoAnalysis },
      { new: true }
    );

    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    res.json({ message: 'Video analysis updated', videoAnalysis: interview.videoAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch videoAnalysis by interview _id
router.get('/:id/video-analysis', async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await MockInterview.findById(id);

    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    res.json({ videoAnalysis: interview.videoAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/generate-interview', async (req, res) => {
    try {
      const { jobPos, jobDesc, jobExp, userId } = req.body;
  
      if (!jobPos || !jobDesc || !jobExp || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const inputPrompt = `Job Position: ${jobPos}, Job Description: ${jobDesc}, Years Of Experience: ${jobExp}. 
                           Depending on this information, give me 5 interview questions with their answers in JSON format.`;
                           
      const result = await chatSession.sendMessage(inputPrompt);
   
      const mockJsonResp = result.response.text().replace('```json', '').replace('```', '').trim();
      
      const newInterview = new MockInterview({
        jsonMockResp: mockJsonResp,
        jobPosition: jobPos,
        jobDesc: jobDesc,
        jobExperience: jobExp,
        user: userId
      });
  
      await newInterview.save();
  
      res.status(201).json({ 
        message: 'Interview generated successfully',
        interview: newInterview 
      });
  
    } catch (error) {
      console.error('Interview generation error:', error);
      res.status(500).json({ error: 'Failed to generate interview' });
    }
  });

router.get('/:interviewId', async (req, res) => {
    try {
        const { interviewId } = req.params;
        const interview = await MockInterview.findById(interviewId);
        
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json(interview);
    } catch (error) {
        console.error('Error fetching interview details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/user-answer', async (req, res) => {
  try {
      const { mockIdRef, question, correctAns, userAns, feedback, rating, userId } = req.body;
      console.log("USER_ANSWER");
      console.log(req.body);
      if (!mockIdRef || !question || !correctAns || !userAns || !feedback || !rating || !userId) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const mockInterview = await MockInterview.findById(mockIdRef);
      if (!mockInterview) {
          return res.status(404).json({ message: 'Mock Interview not found' });
      }
      const newUserAnswer = new UserAnswer({
          mockIdRef,
          question,
          correctAns,
          userAns,
          feedback,
          rating,
          user:userId
      });
      await newUserAnswer.save();

      res.status(201).json({
          message: 'User Answer recorded successfully',
          userAnswer: newUserAnswer
      });

  } catch (error) {
      console.error('User Answer insertion error:', error);
      res.status(500).json({ error: 'Failed to insert user answer' });
  }
});

router.get('/feedback/:interviewId', async (req, res) => {
  try {
    console.log("FEEDBACK ROUTE");
    const { interviewId } = req.params;
    const userAnswers = await UserAnswer.find({ mockIdRef: interviewId })

    if (!userAnswers || userAnswers.length === 0) {
      return res.status(404).json({ message: 'No responses found for this interview' });
    }
    res.status(200).json(userAnswers);
  } catch (error) {
    console.error('Error fetching interview answers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-interviews/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const interviews = await MockInterview.find({ user: userId });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: 'No interviews found for this user' });
    }

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interview details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const multer = require('multer');
const path = require('path');

const {
    handleScreenshotUpload
} = require('../controller/screenshotController');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/screenshots');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `screenshot-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/upload-screenshots', upload.array('images', 100), handleScreenshotUpload);


module.exports = router;
