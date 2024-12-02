const Student = require('../models/studentSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerStudent = async (req, res) => {
    try {
        const { firstName, lastName, rollNumber, branch, phone, email, gender, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !rollNumber || !branch || !phone || !email || !gender || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check for duplicate roll number or email
        const existingStudent = await Student.findOne({ $or: [{ rollNumber }, { email }] });
        if (existingStudent) {
            console.log("Student found:", student);

            return res.status(400).json({ message: 'Roll number or email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new student
        const student = new Student({
            firstName,
            lastName,
            rollNumber,
            branch,
            phone,
            email,
            gender,
            password: hashedPassword, // Save hashed password
        });

        await student.save();

        res.status(201).json({
            message: 'Student registered successfully.',
            student: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                rollNumber: student.rollNumber,
                branch: student.branch,
                phone: student.phone,
                email: student.email,
                gender: student.gender,
                password:student.password
            }, // Exclude password in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.log("JWT_SECRET is not set correctly");
            return res.status(500).json({ message: 'Internal server error. JWT_SECRET not set.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: student._id, email: student.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            student: {
                id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
