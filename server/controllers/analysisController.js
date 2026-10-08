const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { matchJob } = require('../services/jobMatcher');

// @desc    Perform analysis on a resume against jobs
// @route   POST /api/analysis/:resumeId
// @access  Private
exports.createAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const jobs = await Job.find();
    const userSkills = resume.parsedData.skills;

    const matchedJobs = [];
    const skillGaps = [];

    jobs.forEach(job => {
      const matchResult = matchJob(userSkills, job.requiredSkills);
      
      matchedJobs.push({
        jobId: job._id,
        matchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills
      });

      if (matchResult.missingSkills.length > 0) {
        skillGaps.push({
          jobId: job._id,
          missingSkills: matchResult.missingSkills,
          recommendedSkills: matchResult.missingSkills // Simply recommended missing skills for now
        });
      }
    });

    // Sort matched jobs by highest percentage
    matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    const analysis = await Analysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      resumeScore: resume.resumeScore.total,
      extractedSkills: userSkills,
      matchedJobs,
      skillGaps
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analysis for a resume
// @route   GET /api/analysis/:resumeId
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ resumeId: req.params.resumeId })
                                   .populate('matchedJobs.jobId')
                                   .populate('skillGaps.jobId');
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analysis history
// @route   GET /api/analysis/history
// @access  Private
exports.getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user._id })
                                  .populate('resumeId')
                                  .populate('matchedJobs.jobId')
                                  .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
