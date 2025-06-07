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
app.use('/api/interview', require("./routes/interviewRouter"));
app.use('/api/response', require('./routes/responseRoutes'));




app.listen(PORT,()=>{
  console.log("Server is running on Port",PORT);
  dbconnect();
})

module.exports = app;