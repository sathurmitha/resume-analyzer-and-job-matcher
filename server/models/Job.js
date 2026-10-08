const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['internal', 'linkedin', 'naukri', 'internshala'],
    default: 'internal',
    index: true
  },
  sourceJobId: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String, // Full-time, Part-time, Contract, Internship
    required: true
  },
  experienceLevel: {
    type: String, // Entry, Mid, Senior, Director
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [String],
  salary: {
    type: String
  },
  applicationUrl: {
    type: String
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});

jobSchema.index({ source: 1, sourceJobId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Job', jobSchema);
