const mongoose = require('mongoose')
const { Case } = require('../models/caseModel')

/**
 * Format a date to readable string format
 * @param {Date} date - Date to format
 * @returns {String} Formatted date string
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


const createCase = async (req, res) => {
    const obj = req.body;
    console.log(obj)

    const newCase = new Case(obj);

    try {
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


const updateCase = async (req, res) => {
    const { cnr_number } = req.params;
    const { obj } = req.body;

    try {
        const casee = await Case.findOne({ cnr_number: cnr_number });

        if (!casee) {
            res.status(404).json({ message: "Case not found" });
            return;
        }



        const updatedCase = await Case.findOneAndUpdate(
            { cnr_number: cnr_number },
            obj,
            { new: true }
        );

        res.status(200).json({ case: updatedCase, message: 'Case updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateCase };

const getAllCase = async (req, res) => {
    try {
        const cases = await Case.find()

        if (cases.length === 0) {
            res.status(404).json({ message: "No cases found" })
            return
        }
        
        // Format dates in all cases
        const formattedCases = cases.map(caseItem => {
            const formattedCase = {
                ...caseItem._doc,
                filing_date: formatDate(caseItem.filing_date),
                filing_date_raw: caseItem.filing_date
            };
            
            // Also format next_hearing_date if it exists in cnr_details
            if (caseItem.cnr_details && caseItem.cnr_details.case_status && caseItem.cnr_details.case_status.next_hearing_date) {
                formattedCase.cnr_details.case_status.next_hearing_date_formatted = 
                    formatDate(caseItem.cnr_details.case_status.next_hearing_date);
            }
            
            return formattedCase;
        });

        res.status(200).json({ "cases": formattedCases })


    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


const getCaseByCnr = async (req, res) => {
    const { cnr_number } = req.params;
    try {

        if (!cnr_number) {
            res.status(401).json({ message: "CNR number not found" })
            return
        }

        const casee = await Case.findOne(
            {
                cnr_number: cnr_number

            }
        )
        
        // Format dates before sending the response
        let formattedCase = null;
        if (casee) {
            formattedCase = {
                ...casee._doc,
                filing_date: formatDate(casee.filing_date),
                filing_date_raw: casee.filing_date
            };
            
            // Also format next_hearing_date if it exists in cnr_details
            if (casee.cnr_details && casee.cnr_details.case_status && casee.cnr_details.case_status.next_hearing_date) {
                formattedCase.cnr_details.case_status.next_hearing_date_formatted = 
                    formatDate(casee.cnr_details.case_status.next_hearing_date);
            }
        }

        res.status(200).json({ case: formattedCase || casee, message: 'case found' })
    }
    catch
    (error) {
        res.status(404).json({ message: error.message })
    }


}



const { Prisioner } = require('../models/prisionerModels');

const addCaseToPrisioner = async (req, res) => {
    const { cnr_number, registration_number } = req.body;
    const { prisionerId } = req.params;

    if (!cnr_number || !registration_number || !prisionerId) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing required fields" 
        });
    }
    
    try {
        // Find the case by CNR number and registration number
        const caseToAdd = await Case.findOne({
            cnr_number: cnr_number,
            'cnr_details.case_details.registration_number': registration_number
        });

        if (!caseToAdd) {
            return res.status(404).json({ 
                success: false, 
                message: "Case not found with the provided CNR number and registration number" 
            });
        }

        // Find the prisoner by ID
        const prisioner = await Prisioner.findById(prisionerId);

        if (!prisioner) {
            return res.status(404).json({ 
                success: false, 
                message: "Prisoner not found" 
            });
        }

        // Check if the case is already in the prisoner's cases array
        if (prisioner.cases && prisioner.cases.includes(caseToAdd._id)) {
            return res.status(400).json({ 
                success: false, 
                message: "This case is already added to your profile" 
            });
        }

        // Add the case to the prisoner's cases array
        prisioner.cases = prisioner.cases || [];
        prisioner.cases.push(caseToAdd._id);
        await prisioner.save();

        return res.status(200).json({ 
            success: true, 
            message: "Case successfully added to your profile", 
            case: caseToAdd 
        });
    } catch (error) {
        console.error("Error adding case to prisoner:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while adding case to profile", 
            error: error.message 
        });
    }
};

module.exports = {
    createCase,
    getAllCase,
    getCaseByCnr,
    addCaseToPrisioner
}