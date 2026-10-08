const express = require('express');
const router = express.Router();
const { getJobs, getMatchedJobs, getJob, saveJob, unsaveJob, getSavedJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Note: /saved must come before /:id to prevent 'saved' being treated as an id
router.get('/saved', protect, getSavedJobs);
router.get('/matches', protect, getMatchedJobs);
router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);

module.exports = router;
