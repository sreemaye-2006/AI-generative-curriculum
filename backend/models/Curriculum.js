const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    target: { type: String },
    difficulty: { type: String },
    weeks: [{
        week: Number,
        title: String,
        description: String,
        subtopics: [String],
        completed: { type: Boolean, default: false }
    }],
    isCurrent: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);
