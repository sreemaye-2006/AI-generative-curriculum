const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            semester: user.semester,
            skillLevel: user.skillLevel,
            weakSubjects: user.weakSubjects,
            careerGoal: user.careerGoal,
            numberOfWeeks: user.numberOfWeeks,
            progress: user.progress,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.semester = req.body.semester || user.semester;
        user.skillLevel = req.body.skillLevel || user.skillLevel;
        user.weakSubjects = req.body.weakSubjects || user.weakSubjects;
        user.careerGoal = req.body.careerGoal || user.careerGoal;
        user.numberOfWeeks = req.body.numberOfWeeks || user.numberOfWeeks;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            semester: updatedUser.semester,
            skillLevel: updatedUser.skillLevel,
            careerGoal: updatedUser.careerGoal,
            weakSubjects: updatedUser.weakSubjects,
            numberOfWeeks: updatedUser.numberOfWeeks,
            progress: updatedUser.progress,
            token: req.headers.authorization?.split(' ')[1],
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
