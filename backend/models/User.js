const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    semester: { type: String },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    weakSubjects: [String],
    careerGoal: { type: String, enum: ['Placement', 'Higher Studies', 'Startup'], default: 'Placement' },
    numberOfWeeks: { type: Number, default: 4, min: 1, max: 16 },
    completedTopics: [{ type: String }],
    progress: { type: Number, default: 0 },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
