const express =require('express');
const router = express.Router();
const interviewController =require('../controller/interviewController');

router.post("/save-transcript",interviewController.saveTranscript);

module.exports =router;