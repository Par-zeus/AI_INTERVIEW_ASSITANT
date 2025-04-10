const express =require('express');
const router = express.Router();
const scheduleInterview =require('../controller/ScheduleInterview');

router.post("/scheduled",scheduleInterview.createInterview);
router.get("/scheduled",scheduleInterview.getAllInterviews);
router.post('/Active', scheduleInterview.getScheduledInterviews);
router.get('/stats',  scheduleInterview.getInterviewStats);
router.get('/details/:interviewId', scheduleInterview.getInterviewDetails);
router.get('/:interviewId', scheduleInterview.getInterviewById);
router.post('/Past',  scheduleInterview.getPastInterviews);

module.exports =router;