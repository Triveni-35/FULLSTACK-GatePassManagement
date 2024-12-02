const express = require('express');
const { registerStudent, loginStudent } = require('../controllers/studentController');

const router = express.Router();

// Route to register a new student
router.post('/register', registerStudent);
router.post('/login', loginStudent);


module.exports = router;
