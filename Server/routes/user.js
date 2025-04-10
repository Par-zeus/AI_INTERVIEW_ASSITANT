const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const axios=require("axios");
const cloudinary = require("cloudinary").v2;
const { analyzeResume } = require("../middleware/analyzeResume"); // Resume analysis function
const usersController = require("../controller/usersController");
const User = require('../model/user');

router.get("/:email",usersController.getUser)
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware for handling file upload
const handleFileUpload = upload.single("resume");

// Route for updating user with resume analysis
router.put("/:email", handleFileUpload, async (req, res) => {
  try {
    // ✅ Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const resumePath = path.join(uploadsDir, req.file.filename);
    console.log("Analyzing resume:", resumePath);

    // ✅ Step 1: Analyze the resume using the Python script
    let analysisResult;
    try {
      analysisResult = analyzeResume(resumePath);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      return res.status(500).json({ message: "Error analyzing resume", error: err.message });
    }

    if (!analysisResult || !analysisResult.suggestedRole) {
      return res.status(500).json({ message: "Failed to analyze resume. No output received." });
    }

    const { suggestedRole, resumeScore, improvements } = analysisResult;
    console.log("Suggested Role:", suggestedRole);

    // ✅ Step 2: Upload the resume to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(resumePath, {
        folder: "resumes",
        resource_type: "raw", // Ensure non-image files are uploaded correctly
      });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Failed to upload resume", error: err.message });
    }

    // ✅ Step 3: Update user data in the database
    req.body.resumeUrl = cloudinaryResponse.secure_url;
    req.body.suggestedRole = suggestedRole;
    req.body.resumeScore = resumeScore;
    req.body.improvements = improvements;

    // ✅ Pass req & res to updateUser (fixes calling issue)
    await usersController.updateUser(req, res);

    // ✅ Step 4: Clean up temporary file asynchronously
    fs.unlink(resumePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ message: "Error processing resume", error: error.message });
  }
});

// In your userRoutes.js
router.post("/:email/analyze-resume", async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get user's existing resume URL
    const user = await User.findOne({ email });
    if (!user || !user.resume) {
      return res.status(400).json({ message: "No resume found for analysis" });
    }

    // Download resume from Cloudinary for analysis
    const response = await axios.get(user.resume, { responseType: 'arraybuffer' });
    console.log(response);
    const tempPath = path.join(uploadsDir, `temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, response.data);

    // Analyze resume
    const analysisResult = await analyzeResume(tempPath);
    console.log(analysisResult);
    // Clean up temp file
    fs.unlinkSync(tempPath);

    // Send back recommendations
    res.status(200).json({
      recommendedRoles: analysisResult.suggestedRole,
      improvements: analysisResult.improvements
    });

  } catch (error) {
    console.error("Error analyzing existing resume:", error);
    res.status(500).json({ message: "Error analyzing resume" });
  }
});
module.exports = router;
