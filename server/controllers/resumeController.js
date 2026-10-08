const Resume = require('../models/Resume');
const { extractTextFromPDF } = require('../services/pdfParser');
const { extractSkills, extractContactInfo, calculateScore } = require('../services/skillExtractor');
const User = require('../models/User');

// @desc    Upload and parse resume
// @route   POST /api/resumes/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // 1. Extract text from PDF
    const extractedText = await extractTextFromPDF(filePath);

    // 2. Analyze text
    const skills = extractSkills(extractedText);
    const contactInfo = extractContactInfo(extractedText);

    // Build parsed data (simplified for now)
    const parsedData = {
      personalInfo: {
        name: req.user.name, // Fallback to user name
        email: contactInfo.email || req.user.email,
        phone: contactInfo.phone || ''
      },
      skills: skills,
      education: [], // In a real app, use NLP to extract these
      experience: [],
      projects: [],
      certifications: []
    };

    // 3. Calculate Score
    const { score, strengths, improvements } = calculateScore(parsedData, extractedText);

    // 4. Save to DB
    const resume = await Resume.create({
      userId: req.user._id,
      fileName,
      filePath,
      extractedText,
      parsedData,
      resumeScore: score,
      strengths,
      improvements
    });

    // Optionally update user skills if they want
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { skills: { $each: skills } }
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user resumes
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Check user ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
