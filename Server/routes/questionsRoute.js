const express = require('express');
const { getNextQuestion } = require('../controller/questionsController');

const router = express.Router();

router.post('/get-next-question', getNextQuestion);

module.exports = router;
