const { Governor } = require('../models/governorModels');
const { Case } = require('../models/caseModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Governor Registration
const registerGovernor = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body)

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required fields"
            });
        }

        // Check if governor already exists
        const existingGovernor = await Governor.findOne({ email });
        if (existingGovernor) {
            return res.status(400).json({
                success: false,
                message: "Governor already exists with this email"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new governor
        const newGovernor = new Governor({
            name,
            email,
            password: hashedPassword,
        });

        await newGovernor.save();

        res.status(201).json({
            success: true,
            message: "Governor registered successfully",
            governor: {
                id: newGovernor._id,
                name: newGovernor.name,
                email: newGovernor.email,
            }
        });

    } catch (error) {
        console.error("Error registering governor:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register governor",
            error: error.message
        });
    }
};

// Governor Login
const loginGovernor = async (req, res) => {
    try {
        const { email, password } = req.body;


        // Check if governor exists
        const governor = await Governor.findOne({ email });
        if (!governor) {
            return res.status(404).json({
                success: false,
                message: "Governor not found"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, governor.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: governor._id, role: 'governor' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: governor._id,
                name: governor.name,
                email: governor.email,
                state: governor.state,
                designation: governor.designation,
                type: 'Governor'
            }
        });

    } catch (error) {
        console.error("Error in governor login:", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
};

// Get logged in Governor
const getLoggedInGovernor = async (req, res) => {
    try {
        const governor = await Governor.findById(req.user.id).select('-password');
        
        if (!governor) {
            return res.status(404).json({
                success: false,
                message: "Governor not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                ...governor._doc,
                type: 'Governor'
            }
        });

    } catch (error) {
        console.error("Error fetching governor:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch governor details",
            error: error.message
        });
    }
};

// Get all Cases
const getAllCases = async (req, res) => {
    try {
        const cases = await Case.find()

        res.status(200).json({
            success: true,
            count: cases.length,
            cases
        });

    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cases",
            error: error.message
        });
    }
};

// Get case by ID
const getCaseById = async (req, res) => {
    try {
        const caseId = req.params.caseId;
        
        const caseData = await Case.findById(caseId)
            .populate('priosioner', 'name age gender')
            .populate('lawyer', 'name email phone');
            
        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: "Case not found"
            });
        }

        res.status(200).json({
            success: true,
            case: caseData
        });

    } catch (error) {
        console.error("Error fetching case:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch case details",
            error: error.message
        });
    }
};

// Update case information
const updateCaseInfo = async (req, res) => {
    try {
        const { caseId } = req.params;
        const updateData = req.body;

        console.log('Case ID:', caseId);
        console.log('Updated data:', updateData);
    
        // Find the case
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            console.log('Case not found with ID:', caseId);
            return res.status(404).json({
                success: false,
                message: "Case not found"
            });
        }
        
        console.log('Found case:', caseData.cnr_number);
        
        // Initialize case_status if it doesn't exist
        if (!caseData.cnr_details) {
            caseData.cnr_details = {};
        }
        
        if (!caseData.cnr_details.case_status) {
            caseData.cnr_details.case_status = {};
        }
        
        // Update case status fields if provided
        if (updateData.status) {
            console.log('Updating status to:', updateData.status);
            caseData.cnr_details.case_status.case_stage = updateData.status;
            // Also set current_status for compatibility
            caseData.cnr_details.case_status.current_status = updateData.status;
        }
        
        // Update next hearing date if provided
        if (updateData.nextHearingDate) {
            console.log('Updating next hearing date to:', updateData.nextHearingDate);
            caseData.cnr_details.case_status.next_hearing_date = updateData.nextHearingDate;
        }
        
        // Update first hearing date if provided
        if (updateData.firstHearingDate) {
            console.log('Updating first hearing date to:', updateData.firstHearingDate);
            caseData.cnr_details.case_status.first_hearing_date = updateData.firstHearingDate;
        }

        // Update court number and judge if provided
        if (updateData.courtAndJudge) {
            console.log('Updating court and judge to:', updateData.courtAndJudge);
            caseData.cnr_details.case_status.court_number_and_judge = updateData.courtAndJudge;
        }

        // Update decision date if provided
        if (updateData.decisionDate) {
            console.log('Updating decision date to:', updateData.decisionDate);
            caseData.cnr_details.case_status.decision_date = updateData.decisionDate;
        }
        
        // Update case details fields if provided
        if (updateData.caseType) {
            console.log('Updating case type to:', updateData.caseType);
            caseData.cnr_details.case_details.case_type = updateData.caseType;
        }

        if (updateData.filingNumber) {
            console.log('Updating filing number to:', updateData.filingNumber);
            caseData.cnr_details.case_details.filing_number = updateData.filingNumber;
        }

        if (updateData.filingDate) {
            console.log('Updating filing date to:', updateData.filingDate);
            caseData.cnr_details.case_details.filing_date = updateData.filingDate;
        }

        if (updateData.registrationNumber) {
            console.log('Updating registration number to:', updateData.registrationNumber);
            caseData.cnr_details.case_details.registration_number = updateData.registrationNumber;
        }

        if (updateData.registrationDate) {
            console.log('Updating registration date to:', updateData.registrationDate);
            caseData.cnr_details.case_details.registration_date = updateData.registrationDate;
        }

        // Update petitioner and advocate information if provided
        if (updateData.petitioner) {
            console.log('Updating petitioner to:', updateData.petitioner);
            caseData.cnr_details.petitioner_and_advocate_details.petitioner = updateData.petitioner;
        }

        if (updateData.advocate) {
            console.log('Updating advocate to:', updateData.advocate);
            caseData.cnr_details.petitioner_and_advocate_details.advocate = updateData.advocate;
        }

        // Update respondent information if provided
        if (updateData.respondents && Array.isArray(updateData.respondents)) {
            console.log('Updating respondents to:', updateData.respondents);
            caseData.cnr_details.respondent_and_advocate_details = updateData.respondents;
        }
        
        // Update act details if provided
        if (updateData.acts && Array.isArray(updateData.acts)) {
            console.log('Updating acts to:', updateData.acts);
            caseData.cnr_details.act_details = updateData.acts;
        }
        
        // Update comment/nature of disposal if provided
        if (updateData.comment) {
            console.log('Updating comment to:', updateData.comment);
            caseData.cnr_details.case_status.nature_of_disposal = updateData.comment;
            
            // Add to case history
            if (!caseData.cnr_details.case_history_details) {
                caseData.cnr_details.case_history_details = [];
            }
            
            caseData.cnr_details.case_history_details.push({
                purpose_of_hearing: 'Update by Governor',
                business_on_date: new Date(),
                judge: 'Governor',
                comment: updateData.comment
            });
        }
        
        // Mark as modified to ensure save works
        caseData.markModified('cnr_details');
        
        // Update case with new data
        const updatedCase = await caseData.save();
        console.log('Case updated successfully');
    
        res.status(200).json({
            success: true,
            message: "Case updated successfully",
            case: updatedCase
        });

    } catch (error) {
        console.error("Error updating case:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update case",
            error: error.message
        });
    }
};

// Get all modifications made by the governor
const getGovernorModifications = async (req, res) => {
    try {
        const governorId = req.user.id;
        
        const governor = await Governor.findById(governorId)
            .populate({
                path: 'modifiedCases.caseId',
                select: 'caseNumber title description'
            });
            
        if (!governor) {
            return res.status(404).json({
                success: false,
                message: "Governor not found"
            });
        }
        
        res.status(200).json({
            success: true,
            modifications: governor.modifiedCases
        });

    } catch (error) {
        console.error("Error fetching modifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch modifications",
            error: error.message
        });
    }
};

module.exports = {
    registerGovernor,
    loginGovernor,
    getLoggedInGovernor,
    getAllCases,
    getCaseById,
    updateCaseInfo,
    getGovernorModifications
};
