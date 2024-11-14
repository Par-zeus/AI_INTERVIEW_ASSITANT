require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const OpenAI = require('openai');

// Environment variables
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/AI-Interview-Assistant";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'], // Add your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
const userProfileRoutes = require('./routes/userProfile');
app.use('/api/profile', userProfileRoutes);
// Interview questions data structure
const interviewQuestions = {
  technical: {
    javascript: {
      initial: [
        "Can you explain your experience with JavaScript?",
        "What JavaScript frameworks are you familiar with?",
        "How do you handle asynchronous operations in JavaScript?"
      ],
      followUps: {
        experience: [
          "What was the most challenging JavaScript project you worked on?",
          "How do you stay updated with the latest JavaScript features?",
          "Can you describe a time when you had to optimize JavaScript code?"
        ],
        frameworks: [
          "What made you choose these frameworks?",
          "How do you compare different JavaScript frameworks?",
          "What's your experience with state management in these frameworks?"
        ]
      }
    },
    webdev: {
      initial: [
        "What's your experience with responsive design?",
        "How do you approach web performance optimization?",
        "What's your experience with REST APIs?"
      ],
      followUps: {
        design: [
          "How do you handle different screen sizes?",
          "What CSS frameworks have you worked with?",
          "How do you ensure cross-browser compatibility?"
        ],
        performance: [
          "What tools do you use for performance monitoring?",
          "Can you describe your approach to code splitting?",
          "How do you optimize asset loading?"
        ]
      }
    }
  },
  behavioral: {
    teamwork: {
      initial: [
        "How do you prefer to work in a team?",
        "Describe a successful team project you were part of.",
        "How do you handle conflicts in a team?"
      ],
      followUps: {
        style: [
          "How do you communicate with team members?",
          "What role do you usually take in a team?",
          "How do you handle disagreements with colleagues?"
        ]
      }
    }
  }
};

// Helper function to analyze answers
function analyzeAnswer(answer) {
  const lowerAnswer = answer.toLowerCase();
  
  const keywords = {
    technical: {
      javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
      webdev: ['css', 'html', 'responsive', 'web', 'api', 'rest']
    },
    behavioral: {
      teamwork: ['team', 'group', 'collaborate', 'communication']
    }
  };
  
  let matches = {
    technical: { javascript: 0, webdev: 0 },
    behavioral: { teamwork: 0 }
  };
  
  for (let category in keywords) {
    for (let subcategory in keywords[category]) {
      matches[category][subcategory] = keywords[category][subcategory].filter(
        keyword => lowerAnswer.includes(keyword)
      ).length;
    }
  }
  
  let maxCategory = 'behavioral';
  let maxSubcategory = 'teamwork';
  let maxMatches = 0;
  
  for (let category in matches) {
    for (let subcategory in matches[category]) {
      if (matches[category][subcategory] > maxMatches) {
        maxMatches = matches[category][subcategory];
        maxCategory = category;
        maxSubcategory = subcategory;
      }
    }
  }
  
  return { category: maxCategory, subcategory: maxSubcategory };
}

// API Endpoints

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Save transcript endpoint
app.post('/api/save-transcript', async (req, res) => {
  try {
    const { conversation } = req.body;
    const transcript = conversation.map(entry => 
      `Q: ${entry.question}\nA: ${entry.answer}\n`
    ).join('\n');

    const transcriptsDir = path.join(__dirname, 'transcripts');
    await fs.mkdir(transcriptsDir, { recursive: true });

    // Always append to the same file
    const filePath = path.join(transcriptsDir, 'interview_transcript.txt');
    
    // Add timestamp and separator before new entries
    const timestampedTranscript = `\n--- Interview Session ${new Date().toISOString()} ---\n${transcript}`;
    
    await fs.appendFile(filePath, timestampedTranscript, 'utf8');

    res.status(200).json({ 
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving transcript:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get next question endpoint
app.post('/api/get-next-question', async (req, res) => {
  try {
    const { lastAnswer, questionHistory = [] } = req.body;
    
    // If this is the first question
    if (!lastAnswer || questionHistory.length === 0) {
      const categories = Object.keys(interviewQuestions);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const subcategories = Object.keys(interviewQuestions[randomCategory]);
      const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      const initialQuestions = interviewQuestions[randomCategory][randomSubcategory].initial;
      const question = initialQuestions[Math.floor(Math.random() * initialQuestions.length)];
      
      return res.json({
        success: true,
        question,
        metadata: { category: randomCategory, subcategory: randomSubcategory }
      });
    }
    
    // Analyze the last answer
    const analysis = analyzeAnswer(lastAnswer);
    
    // Get follow-up questions for the analyzed category
    const followUps = interviewQuestions[analysis.category][analysis.subcategory].followUps;
    const followUpTypes = Object.keys(followUps);
    const randomType = followUpTypes[Math.floor(Math.random() * followUpTypes.length)];
    const possibleQuestions = followUps[randomType];
    
    // Filter out questions that have already been asked
    const newQuestions = possibleQuestions.filter(q => !questionHistory.includes(q));
    
    // If all follow-ups have been used, select a new initial question
    if (newQuestions.length === 0) {
      const categories = Object.keys(interviewQuestions);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const subcategories = Object.keys(interviewQuestions[randomCategory]);
      const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      const initialQuestions = interviewQuestions[randomCategory][randomSubcategory].initial;
      const question = initialQuestions[Math.floor(Math.random() * initialQuestions.length)];
      
      return res.json({
        success: true,
        question,
        metadata: { category: randomCategory, subcategory: randomSubcategory, type: 'new_topic' }
      });
    }
    
    // Select a random new question
    const question = newQuestions[Math.floor(Math.random() * newQuestions.length)];
    
    res.json({
      success: true,
      question,
      metadata: { 
        category: analysis.category, 
        subcategory: analysis.subcategory,
        type: 'follow_up'
      }
    });
    
  } catch (error) {
    console.error('Error getting next question:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test OpenAI connectivity
app.get('/api/test-openai', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello!" }],
      max_tokens: 10
    });
    
    res.json({
      success: true,
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

module.exports = app;