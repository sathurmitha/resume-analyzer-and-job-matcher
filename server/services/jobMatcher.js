const matchJob = (userSkills, jobRequiredSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: userSkills,
      missingSkills: []
    };
  }

  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  
  const matchedSkills = [];
  const missingSkills = [];

  jobRequiredSkills.forEach(reqSkill => {
    if (userSkillsLower.includes(reqSkill.toLowerCase())) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
};

module.exports = { matchJob };
