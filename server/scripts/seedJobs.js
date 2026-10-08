const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const sampleJobs = [
  {
    sourceJobId: 'job-1',
    title: 'Software Engineer',
    company: 'TechNova',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'We are looking for a skilled Software Engineer to build scalable web applications.',
    requiredSkills: ['Java', 'Spring Boot', 'React', 'SQL', 'Git'],
    salary: '$120,000 - $150,000',
    applicationUrl: 'https://www.google.com/search?q=TechNova+Software+Engineer+jobs+apply'
  },
  {
    sourceJobId: 'job-2',
    title: 'Full Stack Developer',
    company: 'CloudSphere',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Join our remote team to build cloud-native full-stack solutions.',
    requiredSkills: ['Node.js', 'Express.js', 'React', 'MongoDB', 'Docker', 'AWS'],
    salary: '$130,000 - $160,000',
    applicationUrl: 'https://www.google.com/search?q=CloudSphere+Full+Stack+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-3',
    title: 'React Developer',
    company: 'InnovateLabs',
    location: 'New York, NY',
    jobType: 'Contract',
    experienceLevel: 'Mid',
    description: 'Looking for a React expert to help us rebuild our user dashboard.',
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux'],
    salary: '$90/hr',
    applicationUrl: 'https://www.google.com/search?q=InnovateLabs+React+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-4',
    title: 'Backend Developer',
    company: 'DataEdge',
    location: 'Austin, TX',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    description: 'Entry-level backend developer position focusing on API development.',
    requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Git', 'Linux'],
    salary: '$85,000 - $100,000',
    applicationUrl: 'https://www.google.com/search?q=DataEdge+Backend+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-5',
    title: 'DevOps Engineer',
    company: 'CodeCraft',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Manage our infrastructure and CI/CD pipelines.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
    salary: '$140,000 - $170,000',
    applicationUrl: 'https://www.google.com/search?q=CodeCraft+DevOps+Engineer+jobs+apply'
  },
  {
    sourceJobId: 'job-6',
    title: 'Data Analyst',
    company: 'DataEdge',
    location: 'Austin, TX',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Analyze large datasets to extract meaningful business insights.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Tableau'],
    salary: '$95,000 - $115,000',
    applicationUrl: 'https://www.google.com/search?q=DataEdge+Data+Analyst+jobs+apply'
  },
  {
    sourceJobId: 'job-7',
    title: 'Machine Learning Engineer',
    company: 'TechNova',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Design and implement advanced machine learning models for our core product.',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'AWS'],
    salary: '$150,000 - $190,000',
    applicationUrl: 'https://www.google.com/search?q=TechNova+Machine+Learning+Engineer+jobs+apply'
  },
  {
    sourceJobId: 'job-8',
    title: 'MERN Stack Developer',
    company: 'InnovateLabs',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Build end-to-end features using the MERN stack.',
    requiredSkills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS'],
    salary: '$110,000 - $130,000',
    applicationUrl: 'https://www.google.com/search?q=InnovateLabs+MERN+Stack+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-9',
    title: 'Frontend Vue Developer',
    company: 'CodeCraft',
    location: 'Remote',
    jobType: 'Part-time',
    experienceLevel: 'Entry',
    description: 'Part-time position to maintain our legacy Vue applications.',
    requiredSkills: ['Vue', 'JavaScript', 'HTML', 'CSS'],
    salary: '$40/hr',
    applicationUrl: 'https://www.google.com/search?q=CodeCraft+Frontend+Vue+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-10',
    title: 'Java Developer',
    company: 'CloudSphere',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Maintain and extend our enterprise Java microservices.',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Kubernetes'],
    salary: '$115,000 - $135,000',
    applicationUrl: 'https://www.google.com/search?q=CloudSphere+Java+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-11',
    title: 'Python Developer',
    company: 'TechNova',
    location: 'Remote',
    jobType: 'Contract',
    experienceLevel: 'Mid',
    description: 'Build automation scripts and API integrations using Python.',
    requiredSkills: ['Python', 'Flask', 'Linux', 'Git', 'AWS'],
    salary: '$70/hr',
    applicationUrl: 'https://www.google.com/search?q=TechNova+Python+Developer+jobs+apply'
  },
  {
    sourceJobId: 'job-12',
    title: 'Cloud Engineer',
    company: 'CloudSphere',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Design and optimize our multi-cloud architecture.',
    requiredSkills: ['AWS', 'GCP', 'Azure', 'Terraform', 'Linux', 'Docker'],
    salary: '$145,000 - $175,000',
    applicationUrl: 'https://www.google.com/search?q=CloudSphere+Cloud+Engineer+jobs+apply'
  },
  {
    sourceJobId: 'job-13',
    title: 'UI/UX Designer & Developer',
    company: 'InnovateLabs',
    location: 'New York, NY',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    description: 'Bridge the gap between design and technical implementation.',
    requiredSkills: ['Figma', 'HTML', 'CSS', 'React', 'Tailwind CSS'],
    salary: '$100,000 - $125,000',
    applicationUrl: 'https://www.google.com/search?q=InnovateLabs+UI+UX+Designer+jobs+apply'
  },
  {
    sourceJobId: 'job-14',
    title: 'Database Administrator',
    company: 'DataEdge',
    location: 'Austin, TX',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    description: 'Ensure performance, security, and availability of our databases.',
    requiredSkills: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL', 'Linux'],
    salary: '$130,000 - $150,000',
    applicationUrl: 'https://www.google.com/search?q=DataEdge+Database+Administrator+jobs+apply'
  },
  {
    sourceJobId: 'job-15',
    title: 'Junior Software Engineer',
    company: 'CodeCraft',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    description: 'Great opportunity for recent graduates to learn and grow.',
    requiredSkills: ['Java', 'JavaScript', 'HTML', 'CSS', 'SQL'],
    salary: '$80,000 - $95,000',
    applicationUrl: 'https://www.google.com/search?q=CodeCraft+Junior+Software+Engineer+jobs+apply'
  }
];

const seedDB = async () => {
  try {
    await Job.deleteMany(); // Clear existing demo jobs
    console.log('Previous jobs cleared.');

    await Job.insertMany(sampleJobs);
    console.log('Demo jobs added successfully.');

    process.exit();
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedDB();
