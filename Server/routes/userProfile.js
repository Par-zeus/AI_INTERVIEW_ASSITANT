const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createOrUpdateProfile } = require('../controller/userProfileController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const resumesDir = path.join(uploadsDir, 'resumes');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    next();
  });
};

// Routes
router.post('/profile', handleUpload, createOrUpdateProfile);

module.exports = router;