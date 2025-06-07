const express = require("express");
const router = express.Router();
const handleFileUpload = require("../middleware/multer");
const usersController = require("../controller/usersController");

router.get("/:email", usersController.getUser);
router.put("/:email", handleFileUpload, usersController.updateUser);
router.post("/:email/analyze-resume", async (req, res) => {
  const { email } = req.params;
  const User = require("../model/user");
  const fs = require("fs");
  const path = require("path");
  const axios = require("axios");
  const { analyzeResume } = require("../middleware/analyzeResume");

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resume) {
      return res.status(404).json({ message: "No resume found for this user." });
    }

    // Download the resume from Cloudinary
    const response = await axios.get(user.resume, { responseType: "arraybuffer" });
    const tempPath = path.join(__dirname, `../uploads/temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, response.data);

    const analysisResult = await analyzeResume(tempPath);
    console.log(analysisResult);
    fs.unlinkSync(tempPath); // clean up

    res.status(200).json({
      recommendedRoles: analysisResult.suggestedRoles,
      improvements: analysisResult.improvements,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
});


module.exports = router;
