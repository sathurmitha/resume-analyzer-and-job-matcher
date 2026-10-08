const skillsDictionary = {
  programming: ['java', 'python', 'javascript', 'c', 'c++', 'c#', 'sql', 'ruby', 'go', 'typescript', 'php', 'swift', 'kotlin', 'rust'],
  frontend: ['html', 'css', 'react', 'angular', 'vue', 'tailwind css', 'bootstrap', 'jquery', 'next.js', 'svelte'],
  backend: ['node.js', 'express.js', 'django', 'spring boot', 'flask', 'laravel', 'asp.net', 'ruby on rails'],
  databases: ['mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'oracle', 'sql server', 'cassandra', 'dynamodb'],
  cloud: ['aws', 'azure', 'gcp', 'heroku', 'digitalocean'],
  devops: ['docker', 'kubernetes', 'git', 'github actions', 'jenkins', 'ci/cd', 'linux', 'bash', 'ansible', 'terraform'],
  aiml: ['machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'opencv', 'scikit-learn', 'pandas', 'numpy'],
  tools: ['github', 'vs code', 'postman', 'figma', 'jira', 'confluence', 'slack']
};

const extractSkills = (text) => {
  const extractedSkills = new Set();
  const lowerText = text.toLowerCase();

  for (const category in skillsDictionary) {
    skillsDictionary[category].forEach(skill => {
      // Use regex to find exact word matches to avoid partial matches like "in" inside "linux"
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      if (regex.test(lowerText)) {
        // Find the original casing if possible, or just capitalize properly. 
        // For simplicity, we just use the dictionary skill string and format it properly later or keep it as is.
        // Actually, we'll capitalize the first letter of each word
        const formattedSkill = skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Fix specific casings
        if (skill === 'node.js') extractedSkills.add('Node.js');
        else if (skill === 'express.js') extractedSkills.add('Express.js');
        else if (skill === 'sql') extractedSkills.add('SQL');
        else if (skill === 'aws') extractedSkills.add('AWS');
        else if (skill === 'gcp') extractedSkills.add('GCP');
        else if (skill === 'html') extractedSkills.add('HTML');
        else if (skill === 'css') extractedSkills.add('CSS');
        else if (skill === 'ci/cd') extractedSkills.add('CI/CD');
        else if (skill === 'github actions') extractedSkills.add('GitHub Actions');
        else extractedSkills.add(formattedSkill);
      }
    });
  }

  return Array.from(extractedSkills);
};

const extractContactInfo = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  
  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null
  };
};

const calculateScore = (parsedData, resumeText = '') => {
  let score = {
    total: 0,
    skills: 0,
    education: 0,
    experience: 0,
    projects: 0,
    certifications: 0,
    contact: 0,
    formatting: 0
  };

  const strengths = [];
  const improvements = [];
  const text = String(resumeText || '').replace(/\s+/g, ' ').trim();
  const lowerText = text.toLowerCase();
  const hasSection = (pattern) => pattern.test(lowerText);

  // Contact (Max 10)
  if (parsedData.personalInfo.email) score.contact += 4;
  if (parsedData.personalInfo.phone) score.contact += 4;
  if (parsedData.personalInfo.linkedin || parsedData.personalInfo.github || /linkedin\.com|github\.com/i.test(text)) {
    score.contact += 2;
  }
  if (score.contact === 10) strengths.push('Complete contact details');
  else if (score.contact < 8) improvements.push('Add a phone number and professional profile link');

  // Skills (Max 25)
  const skillsCount = parsedData.skills.length;
  if (skillsCount >= 10) {
    score.skills = 25;
    strengths.push('Strong technical skills variety');
  } else if (skillsCount >= 6) {
    score.skills = 18;
  } else if (skillsCount >= 3) {
    score.skills = 12;
  } else {
    score.skills = skillsCount > 0 ? 6 : 0;
    improvements.push('Add more job-relevant keywords to your skills section');
  }

  // Education (Max 15)
  const hasEducation = parsedData.education?.length > 0 || hasSection(/education|academic background|university|college|bachelor|master|b\.s|m\.s|degree/);
  if (hasEducation) {
    score.education = 15;
  } else {
    score.education = 0;
    improvements.push('Add an education section with your degree and institution');
  }

  // Experience (Max 20)
  const hasExperience = parsedData.experience?.length > 0 || hasSection(/experience|work history|employment|internship|professional background/);
  if (hasExperience) {
    score.experience = 20;
    strengths.push('Good professional experience');
  } else {
    score.experience = 0;
    improvements.push('Add experience or internship details with measurable achievements');
  }

  // Projects (Max 20)
  const hasProjects = parsedData.projects?.length > 0 || hasSection(/projects|personal projects|academic projects|portfolio/);
  if (hasProjects) {
    score.projects = 15;
    strengths.push('Strong project portfolio');
  } else {
    score.projects = 0;
    improvements.push('Add projects with the tools used and measurable outcomes');
  }

  // Certifications (Max 5)
  const hasCertifications = parsedData.certifications?.length > 0 || hasSection(/certifications|certificates|licences|licenses/);
  if (hasCertifications) {
    score.certifications = 5;
    strengths.push('Relevant certifications found');
  } else {
    score.certifications = 0;
    improvements.push('Add relevant certifications when applicable');
  }

  // ATS formatting and parseability (Max 10)
  const sectionCount = [
    /summary|objective|profile/,
    /skills|technical skills/,
    /education/,
    /experience|employment|internship/,
    /projects/,
    /certifications|certificates/
  ].filter(hasSection).length;
  if (text.length >= 400) score.formatting += 4;
  if (sectionCount >= 4) score.formatting += 4;
  else if (sectionCount >= 2) score.formatting += 2;
  if (/\b20\d{2}\b|\b19\d{2}\b/.test(text)) score.formatting += 2;
  if (score.formatting < 7) {
    improvements.push('Use clear standard section headings and include enough searchable text');
  } else {
    strengths.push('Resume content is readable by ATS parsers');
  }

  score.total = score.skills + score.education + score.experience + score.projects + score.certifications + score.contact + score.formatting;

  return { score, strengths, improvements };
};

module.exports = { extractSkills, extractContactInfo, calculateScore };
