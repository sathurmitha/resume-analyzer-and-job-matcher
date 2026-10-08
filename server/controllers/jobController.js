const Job = require('../models/Job');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { matchJob } = require('../services/jobMatcher');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { title, location, type, level, source } = req.query;
    
    let query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.jobType = type;
    if (level) query.experienceLevel = level;
    if (source) query.source = source;

    const jobs = await Job.find(query).sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs ranked against the user's latest resume or profile skills
// @route   GET /api/jobs/matches
// @access  Private
exports.getMatchedJobs = async (req, res) => {
  try {
    const { title, location, type, level, source, limit = 50 } = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.jobType = type;
    if (level) query.experienceLevel = level;
    if (source) query.source = source;

    const [user, latestResume, jobs] = await Promise.all([
      User.findById(req.user._id).select('skills'),
      Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 }).select('parsedData.skills'),
      Job.find(query).sort({ postedDate: -1 }).limit(Math.min(Number(limit) || 50, 100))
    ]);

    const resumeSkills = latestResume?.parsedData?.skills || [];
    const profileSkills = user?.skills || [];
    const userSkills = [...new Set([...resumeSkills, ...profileSkills])];

    const rankedJobs = jobs.map(job => ({
      ...job.toObject(),
      ...matchJob(userSkills, job.requiredSkills)
    })).sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return new Date(b.postedDate) - new Date(a.postedDate);
    });

    res.json({ skills: userSkills, jobs: rankedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/jobs/:id/save
// @access  Private
exports.saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user._id);
    if (user.savedJobs.includes(job._id)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(job._id);
    await user.save();

    res.json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave a job
// @route   DELETE /api/jobs/:id/save
// @access  Private
exports.unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedJobs = user.savedJobs.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'Job removed from saved list', savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get saved jobs
// @route   GET /api/jobs/saved
// @access  Private
exports.getSavedJobs = async (req, res) => {
  try {
    // Note: the route should match exactly, otherwise /saved will hit /:id
    // ensure routes are ordered correctly
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
