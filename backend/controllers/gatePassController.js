
const GatePass = require('../models/gatePassSchema');
const Student = require('../models/studentSchema');

// Apply for Gate Pass (Only for logged-in students)
/*
exports.applyGatePass = async (req, res) => {
    try {
        const { rollNumber, email, phone, branch, purpose, dateTime } = req.body;

        // Ensure the user is a student (role-based access control)
        const student = await Student.findById(req.user.id); // Assuming req.user contains the logged-in student
        if (!student || student.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students can apply for a gate pass.' });
        }

        // Validate that the student is applying for their own gate pass
        if (
            rollNumber !== student.rollNumber ||
            email.toLowerCase() !== student.email.toLowerCase() ||
            phone !== student.phone
        ) {
            return res.status(403).json({ message: 'You can only apply for your own gate pass.' });
        }

        // Create a new gate pass associated with the logged-in student
        const gatePass = new GatePass({
            studentId: req.user.id, // Associate the gate pass with the student who is logged in
            rollNumber,
            email,
            phone,
            branch,
            purpose,
            dateTime,
        });

        await gatePass.save();

        res.status(201).json({
            message: 'Gate pass application submitted successfully.',
            gatePass,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
*/
// Apply for Gate Pass (Only for logged-in students)
exports.applyGatePass = async (req, res) => {
    try {
        const { rollNumber, email, phone, branch, purpose, dateTime } = req.body;

        // Ensure the user is a student (role-based access control)
        const student = await Student.findById(req.user.id); // Assuming req.user contains the logged-in student
        if (!student || student.role !== 'student') {
            return res.status(403).json({ message: 'Access denied. Only students can apply for a gate pass.' });
        }

        // Validate that the student is applying for their own gate pass
        if (
            rollNumber !== student.rollNumber ||
            email.toLowerCase() !== student.email.toLowerCase() ||
            phone !== student.phone
        ) {
            return res.status(403).json({ message: 'You can only apply for your own gate pass.' });
        }

        // Calculate expiry date (e.g., 24 hours from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        // Create a new gate pass associated with the logged-in student
        const gatePass = new GatePass({
            studentId: req.user.id, // Associate the gate pass with the student who is logged in
            rollNumber,
            email,
            phone,
            branch,
            purpose,
            dateTime,
            expiryDate,  // Set the expiry date
        });

        await gatePass.save();

        res.status(201).json({
            message: 'Gate pass application submitted successfully.',
            gatePass,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


// List Gate Pass applications (Available only for admins)
exports.listAllGatePassesForAdmin = async (req, res) => {
    try {
        console.log(req.user);
        if ('admin' !== 'admin') { // Temporary hardcoded check
            return res.status(403).json({ message: 'Access denied. Only admins can view all gate passes.' });
        }

        const gatePasses = await GatePass.find();
        res.status(200).json({ gatePasses });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

// Update Gate Pass Status (Only for Admins)
exports.updateGatePassStatus = async (req, res) => {
    try {
        const { gatePassId } = req.params; // Gate Pass ID from URL
        const { status } = req.body; // Status from request body

        // Ensure the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can update gate pass status.' });
        }

        // Validate the status
        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Status must be either "Accepted" or "Rejected".' });
        }

        // Find and update the gate pass
        const gatePass = await GatePass.findByIdAndUpdate(
            gatePassId,
            { status },
            { new: true } // Return the updated document
        );

        if (!gatePass) {
            return res.status(404).json({ message: 'Gate pass not found.' });
        }

        res.status(200).json({
            message: `Gate pass status updated to "${status}".`,
            gatePass
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


exports.listPendingGatePasses = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can view pending gate passes.' });
        }

        const pendingGatePasses = await GatePass.find({ status: 'Pending' });
        res.status(200).json({ pendingGatePasses });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

exports.getStudentGatePass = async (req, res) => {
    try {
        // Find the gate pass for the logged-in student (based on their ID)
        const gatePass = await GatePass.findOne({ studentId: req.user.id });

        if (!gatePass) {
            return res.status(404).json({ message: 'Gate pass not found.' });
        }

        // Return the gate pass details along with its status
        res.status(200).json({
            message: 'Gate pass details fetched successfully.',
            gatePass
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

exports.deleteGatePass = async (req, res) => {
    try {
        // Find and delete the gate pass by studentId and gate pass ID
        const gatePass = await GatePass.findOneAndDelete({ _id: req.params.id, studentId: req.user.id });

        if (!gatePass) {
            return res.status(404).json({ message: 'Gate pass not found or you are not authorized to delete this gate pass.' });
        }

        res.status(200).json({
            message: 'Gate pass withdrawn successfully.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

