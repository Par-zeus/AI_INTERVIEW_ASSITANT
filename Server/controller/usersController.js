const User=require("../model/user")
const mongoose=require('mongoose')
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    try {
        const {email} =req.params;
        const user = await User.findOne({email:email});
        if (user === null) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const getAllUser=async(req,res)=>{
    try {
        const user=await User.find();
        res.json(user)
    } catch (error) {
        res.send("Error while fetching users")
    }
}
const delUser=async(req,res)=>{
    try {
        console.log(req.body.email);
        const user=await User.findOne({email:email});
        await user.deleteOne()
        res.send("User deleted successfully")
    } catch (error) {
        res.status(500).send(error)
    }
}


const createUploadsDirectory = () => {
    const uploadsDir = path.join(__dirname, '../uploads');
    const resumesDir = path.join(uploadsDir, 'resumes');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir);
    }
  };
  
  createUploadsDirectory();
  
  const skillToRoleMapping = {
    'javascript': ['Software Engineer', 'Full Stack Developer'],
    'python': ['Software Engineer', 'Data Scientist'],
    'html': ['Software Engineer', 'Frontend Developer'],
    'css': ['Software Engineer', 'Frontend Developer'],
    'react': ['Software Engineer', 'Frontend Developer'],
    'node': ['Software Engineer', 'Backend Developer'],
    'express': ['Software Engineer', 'Backend Developer'],
    'machine learning': ['Data Scientist', 'ML Engineer'],
    'statistics': ['Data Scientist', 'Data Analyst'],
    'sql': ['Data Scientist', 'Data Engineer'],
    'product management': ['Product Manager'],
    'agile': ['Product Manager', 'Scrum Master'],
    'user stories': ['Product Manager'],
    'ui': ['UX Designer'],
    'ux': ['UX Designer'],
    'figma': ['UX Designer'],
    'user research': ['UX Designer', 'Product Manager']
  };
  
  
  const cloudinary = require('cloudinary').v2;

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });
  
  // Update user function
const updateUser = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("Received File:", req.file);

    // ✅ Extract fields correctly
    const { email } = req.params;
    const { fullName, phone, experience, education, skills, linkedIn,suggestedRole,improvements } = req.body;

    let resumeUrl = null;

    // ✅ Ensure the uploaded file is handled
    if (req.file) {
      const filePath = req.file.path;
      const uploadResponse = await cloudinary.uploader.upload(filePath, { folder: "resumes" });
      resumeUrl = uploadResponse.secure_url;
    }
    // Generate recommended roles based on skills
    const userSkills = skills?.toLowerCase().split(',').map(skill => skill.trim()) || [];
    const recommendedRoles = new Set();

    userSkills.forEach(skill => {
      const roles = skillToRoleMapping[skill] || [];
      roles.forEach(role => recommendedRoles.add(role));
    });
    console.log(recommendedRoles.size);
    if (recommendedRoles.size == 0) {
      recommendedRoles.add("Software Engineer");
    }
    recommendedRoles.add(suggestedRole);

    // ✅ Find and update the user
    let user = await User.findOneAndUpdate(
      { email },
      { fullName, phone, experience, education, skills, linkedIn, resume: resumeUrl,suggestedRole,improvements },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // res.status(200).json({
    //   message: "Profile updated successfully",
    //   user,
      
    // });
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        experience: user.experience,
        education: user.education,
        skills: user.skills,
        linkedIn: user.linkedIn,
        resume: user.resume,
      },
      recommendedRoles: Array.from(recommendedRoles),
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

  
module.exports={
    getAllUser,delUser,updateUser,getUser
}