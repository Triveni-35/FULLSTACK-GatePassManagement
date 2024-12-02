const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db.js');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gatePassRoutes = require('./routes/gatePassRoutes');

require('dotenv').config({ path: './config.env' }); // Load environment variables

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/students', studentRoutes);  // Student-related routes
app.use('/api/admin', adminRoutes);       // Admin-related routes
app.use('/api/gatepass', gatePassRoutes); // GatePass-related routes

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
