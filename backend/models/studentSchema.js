const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'others'], required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' } ,// role added

    password: { type: String, required: true }, 

}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
