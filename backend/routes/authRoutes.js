const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, semester, skillLevel, careerGoal, weakSubjects, numberOfWeeks } = req.body;
    console.log('Registration attempt for:', email);

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            semester: semester || '1st',
            skillLevel: skillLevel || 'Beginner',
            careerGoal: careerGoal || 'Placement',
            weakSubjects: Array.isArray(weakSubjects) ? weakSubjects : [],
            numberOfWeeks: numberOfWeeks || 4,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found in database:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match results:', isMatch);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            console.log('Invalid password for user:', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
