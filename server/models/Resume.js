const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  parsedData: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      linkedin: String,
      github: String
    },
    skills: [String],
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    experience: [{
      company: String,
      role: String,
      duration: String,
      description: String
    }],
    projects: [{
      name: String,
      technologies: [String],
      description: String
    }],
    certifications: [String]
  },
  resumeScore: {
    total: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    contact: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 }
  },
  strengths: [String],
  improvements: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
