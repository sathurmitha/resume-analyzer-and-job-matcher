const express = require('express');
const router = express.Router();
const { createAnalysis, getAnalysis, getAnalysisHistory } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history', protect, getAnalysisHistory);
router.post('/:resumeId', protect, createAnalysis);
router.get('/:resumeId', protect, getAnalysis);

module.exports = router;
