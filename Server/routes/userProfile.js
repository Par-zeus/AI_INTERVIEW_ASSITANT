const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createOrUpdateProfile } = require('../controller/userProfileController');

// Ensure the uploads and resumes directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const resumesDir = path.join(uploadsDir, 'resumes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir); // Save files to the resumes directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Generate a unique filename
  }
});

// File type filter to allow only specific file extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

// Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Middleware to handle single file uploads and errors
const handleFileUpload = (req, res, next) => {
  const uploadSingle = upload.single('resume'); // Accept a single file with the key 'resume'

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors (e.g., file size limit exceeded)
      return res.status(400).json({ message: 'Multer error occurred during file upload.', error: err.message });
    } else if (err) {
      // General errors (e.g., invalid file type)
      return res.status(400).json({ message: 'Error during file upload.', error: err.message });
    }
    next(); // Proceed to the next middleware or controller
  });
};

// Routes
router.post('/profile', handleFileUpload, createOrUpdateProfile);

module.exports = router;
