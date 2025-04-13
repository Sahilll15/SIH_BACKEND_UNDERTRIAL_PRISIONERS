const express = require('express');
const router = express.Router();
const { 
    registerGovernor, 
    loginGovernor, 
    getLoggedInGovernor, 
    getAllCases, 
    getCaseById, 
    updateCaseInfo, 
    getGovernorModifications 
} = require('../controllers/governor.controllers');
const { validateToken } = require('../middlewares/validateToken')

// Authentication routes
router.post('/register', registerGovernor);
router.post('/login', loginGovernor);
router.post('/getLoggedInGovernor', validateToken, getLoggedInGovernor);

// Case management routes
router.get('/cases', getAllCases);
router.get('/cases/:caseId', getCaseById);
router.put('/cases/:caseId', updateCaseInfo);

// Governor-specific routes
router.get('/modifications', validateToken, getGovernorModifications);

module.exports = router;