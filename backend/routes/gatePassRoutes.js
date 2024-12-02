const express = require('express');
const { applyGatePass, listAllGatePassesForAdmin,updateGatePassStatus, getStudentGatePass ,deleteGatePass} = require('../controllers/gatePassController');
const { authenticateJWT } = require('../utils/jwt');

const router = express.Router();

router.post('/apply', authenticateJWT, applyGatePass);
router.get('/admin/list', authenticateJWT, listAllGatePassesForAdmin);
router.patch('/admin/update/:gatePassId', authenticateJWT, updateGatePassStatus); // Add this route
router.get('/student', authenticateJWT, getStudentGatePass);  // Added route for student to view their gate pass
router.delete('/student/:id', authenticateJWT, deleteGatePass);  // Added route for student to delete their gate pass

module.exports = router;
