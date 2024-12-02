const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Link to the student who applied
    rollNumber: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    branch: { type: String, required: true },
    purpose: { type: String, required: true },
    dateTime: { type: Date, required: true }, // Date and time to leave college
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Gate pass status
    expiryDate: {  // Expiry date for the gate pass
        type: Date,
        required: true
    }
}, { timestamps: true });

const GatePass = mongoose.model('GatePass', gatePassSchema);
module.exports = GatePass;
