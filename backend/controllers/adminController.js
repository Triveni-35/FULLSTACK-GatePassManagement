const Admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, gender, department, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !gender || !department || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Admin
        const admin = new Admin({
            firstName,
            lastName,
            email,
            phone,
            gender,
            department,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({
            message: 'Admin registered successfully.',
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
                gender: admin.gender,
                department: admin.department
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: admin._id, role: 'admin' }, // Ensure role is included
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        

        res.status(200).json({
            message: 'Login successful.',
            token,
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
