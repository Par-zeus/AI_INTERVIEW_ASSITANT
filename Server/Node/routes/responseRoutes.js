const express = require('express');
const router = express.Router();
const responseController = require('../controller/responseController');

router.post('/analysis', responseController.createAnalysis);
router.get('/analysis/:mockId', responseController.getAnalysisByMockId);

module.exports = router;
