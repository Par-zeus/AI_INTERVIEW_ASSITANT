const User = require("../model/user");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { analyzeResume } = require("../middleware/analyzeResume");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const filePath = req.file ? req.file.path : null;

    let analysisResult = {};
    let resumeUrl = req.body.resumeUrl;

    if (filePath) {
      analysisResult = await analyzeResume(filePath);

      const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
        folder: "resumes",
        resource_type: "raw",
      });

      resumeUrl = cloudinaryResponse.secure_url;

      fs.unlink(filePath, () => {});
    }

    const {
      resumeScore,
      suggestedRoles,
      improvements,
      formattingSuggestions,
    } = analysisResult;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        ...req.body,
        resume: resumeUrl,
        resumeScore,
        suggestedRoles,
        improvements,
        formattingSuggestions,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    await user.deleteOne();
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { updateUser, getUser, getAllUser, delUser };