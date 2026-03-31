const express = require('express');
const router = express.Router();
const Curriculum = require('../models/Curriculum');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { generateCurriculum, generateNotes, generateMCQs } = require('../ai_engine/llm_generator');

// @desc    Generate a new personalized curriculum
// @route   POST /api/curriculum/generate
router.post('/generate', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const curriculumData = await generateCurriculum(user);

        // Deactivate existing curriculum
        await Curriculum.updateMany({ user: user._id }, { isCurrent: false });

        const newCurriculum = await Curriculum.create({
            user: user._id,
            ...curriculumData
        });

        res.status(201).json(newCurriculum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get current curriculum
// @route   GET /api/curriculum/current
router.get('/current', protect, async (req, res) => {
    const curriculum = await Curriculum.findOne({ user: req.user._id, isCurrent: true });
    if (curriculum) {
        res.json(curriculum);
    } else {
        res.status(404).json({ message: 'No active curriculum found' });
    }
});

// @desc    Update topic completion
// @route   PUT /api/curriculum/topics/:id
router.put('/topics/:topicId', protect, async (req, res) => {
    try {
        const curriculum = await Curriculum.findOne({ user: req.user._id, isCurrent: true });
        if (!curriculum) return res.status(404).json({ message: 'Curriculum not found' });

        const weekIdx = curriculum.weeks.findIndex(w => w._id.toString() === req.params.topicId);
        if (weekIdx !== -1) {
            curriculum.weeks[weekIdx].completed = !curriculum.weeks[weekIdx].completed;
            await curriculum.save();

            // Update user global progress
            const completedCount = curriculum.weeks.filter(w => w.completed).length;
            const progress = (completedCount / curriculum.weeks.length) * 100;
            
            await User.findByIdAndUpdate(req.user._id, { progress });

            res.json(curriculum);
        } else {
            res.status(404).json({ message: 'Topic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get AI Content (Notes/Quizzes)
// @route   GET /api/curriculum/content/:type
router.get('/content/:type', protect, async (req, res) => {
    const { type } = req.params;
    const { topic } = req.query;

    if (type === 'notes') {
        const content = await generateNotes(topic);
        res.json(content);
    } else if (type === 'quiz') {
        const quiz = await generateMCQs(topic);
        res.json(quiz);
    } else {
        res.status(400).json({ message: 'Invalid content type' });
    }
});

module.exports = router;
