// Recommender logic for curriculum adaptation
const User = require('../models/User');

const adaptDifficulty = (currentLevel, performanceScore) => {
    if (performanceScore > 80 && currentLevel === 'Beginner') return 'Intermediate';
    if (performanceScore > 80 && currentLevel === 'Intermediate') return 'Advanced';
    if (performanceScore < 40 && currentLevel === 'Advanced') return 'Intermediate';
    if (performanceScore < 40 && currentLevel === 'Intermediate') return 'Beginner';
    return currentLevel;
};

const analyzeSkillGap = (userSkills, industryRequirements) => {
    return industryRequirements.filter(skill => !userSkills.includes(skill));
};

module.exports = { adaptDifficulty, analyzeSkillGap };
