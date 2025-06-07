const User = require("../model/user");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { analyzeResume } = require("../middleware/analyzeResume");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      experience,
      education,
      skills,
      linkedIn,
    } = req.body;

    let resumePath = null;
    let resumeUrl = null;
    let analysisResult = {};

    if (req.file) {
      resumePath = req.file.path;
      analysisResult = await analyzeResume(resumePath);

      const cloudinaryResponse = await cloudinary.uploader.upload(resumePath, {
        folder: "resumes",
        resource_type: "raw",
      });

      resumeUrl = cloudinaryResponse.secure_url;
      fs.unlinkSync(resumePath);
    }

    const {
      resumeScore,
      suggestedRoles,
      improvements,
      formattingSuggestions,
    } = analysisResult;

    let user = await User.findOne({ email });

    const updatedData = {
      fullName,
      phone,
      experience,
      education,
      skills,
      linkedIn,
      resume: resumeUrl,
      resumeScore,
      suggestedRoles,
      improvements,
      formattingSuggestions,
    };

    if (user) {
      user = await User.findOneAndUpdate({ email }, updatedData, { new: true });
    } else {
      user = new User({
        email,
        ...updatedData,
        roles: { User: 2001 },
      });
      await user.save();
    }

    res.status(200).json({
      message: user ? "Profile updated successfully" : "Profile created successfully",
      user,
      recommendedRoles: suggestedRoles || [],
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Error handling profile:", error);
    res.status(500).json({ message: "Error handling profile", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrUpdateProfile,
  getUserProfile,
};
