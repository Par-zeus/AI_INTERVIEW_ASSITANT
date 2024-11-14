// controllers/userProfileController.js
const User = require('../model/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Create uploads directory if it doesn't exist
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
  'react': ['Software Engineer', 'Frontend Developer'],
  'node': ['Software Engineer', 'Backend Developer'],
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
    //   password, // Add password field for new users
    //   username  // Add username field for new users
    } = req.body;

    let resumePath = null;
    if (req.file) {
      resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    // Generate recommended roles based on skills
    const userSkills = skills?.toLowerCase().split(',').map(skill => skill.trim()) || [];
    const recommendedRoles = new Set();

    userSkills.forEach(skill => {
      const roles = skillToRoleMapping[skill] || [];
      roles.forEach(role => recommendedRoles.add(role));
    });

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { email },
        {
          fullName,
          phone,
          experience,
          education,
          skills,
          linkedIn,
          resume: resumePath
        },
        { new: true }
      );
    } else {
      // Create new user
      // Hash password for new user
    //   const hashedPassword = await bcrypt.hash(password || 'defaultPassword123', 10);
      
      user = new User({
        // username: username || email.split('@')[0], // Use email prefix as username if not provided
        email,
        // password: hashedPassword,
        fullName,
        phone,
        experience,
        education,
        skills,
        linkedIn,
        resume: resumePath,
        roles: { User: 2001 } // Default user role
      });

      await user.save();
    }
    console.log(user);
    res.status(200).json({
      message: user ? 'Profile updated successfully' : 'Profile created successfully',
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        experience: user.experience,
        education: user.education,
        skills: user.skills,
        linkedIn: user.linkedIn,
        resume: user.resume
      },
      recommendedRoles: Array.from(recommendedRoles)
    });

  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error handling profile:', error);
    res.status(500).json({ 
      message: 'Error handling profile', 
      error: error.message 
    });
  }
};

module.exports = {
  createOrUpdateProfile
};