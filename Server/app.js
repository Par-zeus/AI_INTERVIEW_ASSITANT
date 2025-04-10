require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');
const cookieParser = require("cookie-parser");
const corsOptions=require("./config/corsOptions");
const credentials=require("./middleware/credentials");
const verifyJWT=require('./middleware/verifyJWT');
const multer = require('multer');
const csv = require('csv-parser');
const speech = require('@google-cloud/speech');
const questionRoutes=require('./routes/questionsRoute');
// Environment variables
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL  ;

const dbconnect= async()=>{
  await mongoose.connect(MONGO_URL)
  .then(()=>{
      console.log('connected')
    }).catch((err)=>{
      console.log(err)
    })
}
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/register',require('./routes/register'));
app.use("/login",require('./routes/auth'));
app.use("/refresh" ,require('./routes/refresh'));
app.use("/logout" ,require("./routes/logout"));


const userProfileRoutes = require('./routes/userProfile');
app.use('/api/profile', userProfileRoutes);
// Interview questions data structure


// Function to load questions from CSV
function loadQuestionsFromCSV() {
  return new Promise((resolve, reject) => {
    const questions = {};

    fs.createReadStream('interview_questions.csv')
      .pipe(csv())
      .on('data', (row) => {
        const role = row.Category;
        
        // Organize questions by role
        if (!questions[role]) {
          questions[role] = {
            easy: [],
            medium: [],
            hard: []
          };
        }

        // Categorize questions by difficulty
        switch (row.Difficulty.toLowerCase()) {
          case 'easy':
            questions[role].easy.push(row.Question);
            break;
          case 'medium':
            questions[role].medium.push(row.Question);
            break;
          case 'hard':
            questions[role].hard.push(row.Question);
            break;
        }
      })
      .on('end', () => {
        resolve(questions);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Global variable to store loaded questions
let loadedQuestions = null;

app
// app.post('/api/get-next-question', async (req, res) => {

//   try {
//     // Load questions if not already loaded
//     if (!loadedQuestions) {
//       loadedQuestions = await loadQuestionsFromCSV();
//     }

//     const { lastAnswer, role, questionHistory = [] } = req.body;
    
//     // Validate role
//     if (!loadedQuestions[role]) {
//       return res.status(400).json({
//         success: false,
//         error: `No questions found for role: ${role}`
//       });
//     }

//     // If this is the first question
//     if (!lastAnswer || questionHistory.length === 0) {
//       // Randomly select difficulty levels with a bias towards easier questions
//       const difficultyLevels = ['easy', 'easy', 'easy', 'medium', 'medium', 'hard'];
//       const randomDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
      
//       const roleQuestions = loadedQuestions[role][randomDifficulty];
      
//       // Ensure we don't repeat questions
//       const availableQuestions = roleQuestions.filter(q => !questionHistory.includes(q));
      
//       if (availableQuestions.length === 0) {
//         return res.status(404).json({
//           success: false,
//           error: 'No more unique questions available'
//         });
//       }

//       const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      
//       return res.json({
//         success: true,
//         question,
//         metadata: { 
//           role, 
//           difficulty: randomDifficulty 
//         }
//       });
//     }

//     // Logic for follow-up questions can be added here if needed
//     // For now, we'll just generate another random question
//     const difficultyLevels = ['easy', 'easy', 'easy', 'medium', 'medium', 'hard'];
//     const randomDifficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    
//     const roleQuestions = loadedQuestions[role][randomDifficulty];
    
//     // Ensure we don't repeat questions
//     const availableQuestions = roleQuestions.filter(q => !questionHistory.includes(q));
    
//     if (availableQuestions.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'No more unique questions available'
//       });
//     }

//     const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
//     return res.json({
//       success: true,
//       question,
//       metadata: { 
//         role, 
//         difficulty: randomDifficulty 
//       }
//     });

//   } catch (error) {
//     console.error('Error generating question:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to generate interview question'
//     });
//   }
// });

// Helper function to analyze answers

app.use('/questions', questionRoutes);
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
app.use('/interview',require('./routes/interview'));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Save transcript endpoint
const upload = multer({ storage: multer.memoryStorage() });
const client = new speech.SpeechClient();

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioBytes = req.file.buffer.toString('base64');
    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    };

    const [response] = await client.recognize(request);
    const transcript = response.results.map((result) => result.alternatives[0].transcript).join('\n');
    res.json({ transcript });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).send('Failed to transcribe audio.');
  }
});
app.use('/interview',require('./routes/ScheduleInterview'));
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

app.use(verifyJWT);
app.use('/users',require('./routes/user'));



app.listen(PORT,()=>{
  console.log("Server is running on Port",PORT);
  dbconnect();
})

module.exports = app;