const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const PracticeQuestion = require('./ActualQuestionSchema'); // Adjust this path

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/AI-Interview-Assistant'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// CSV File Path
const csvFilePath = path.join(__dirname, '../interview_questions.csv');

// Read and Import Data
const importCSVData = async () => {
  const PracticeQuestions = [];

  // Read CSV File
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Transform the row to match schema
      const question = {
        questionText: row['Question'] || 'No question text provided', // Map Question column
        domain: row['Category'] || 'Unknown',                         // Map Category column
        difficulty: row['Difficulty'] || 'Easy',                      // Map Difficulty column
        answers: [row['Answer'] || 'No answer provided'],             // Wrap Answer in an array
      };

      PracticeQuestions.push(question);
    })
    .on('end', async () => {
      try {
        // Bulk Insert to MongoDB
        await PracticeQuestion.insertMany(PracticeQuestions);
        console.log(`${PracticeQuestions.length} questions successfully imported.`);
        process.exit(0);
      } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
      }
    });
};

// Execute Import
importCSVData();
