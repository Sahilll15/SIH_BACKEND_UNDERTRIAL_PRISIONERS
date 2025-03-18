require('dotenv').config();
const mongoose = require('mongoose');
const { Case } = require('../models/caseModel');

mongoose.connect('mongodb://localhost:27017/SIH')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const dummyCases = [
    {
        cnr_number: "MHAU010123452023",
        cnr_details: {
            case_details: {
                case_type: "Criminal",
                filing_number: "CRM/2023/001",
                filing_date: "2023-01-15",
                registration_number: "CR001/2023",
                registration_date: "2023-01-20"
            },
            case_status: {
                first_hearing_date: "2023-02-01",
                next_hearing_date: "2023-03-15",
                case_stage: "Initial Hearing",
                court_number_and_judge: "Court 1, Judge John Doe",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "State of Maharashtra",
                advocate: "Adv. Rajesh Kumar"
            },
            respondent_and_advocate_details: ["John Smith - Adv. Priya Sharma"],
            act_details: [
                {
                    under_act: "Indian Penal Code",
                    under_section: "Section 302"
                }
            ]
        }
    },
    {
        cnr_number: "MHAU010123462023",
        cnr_details: {
            case_details: {
                case_type: "Civil",
                filing_number: "CIV/2023/002",
                filing_date: "2023-02-10",
                registration_number: "CV002/2023",
                registration_date: "2023-02-15"
            },
            case_status: {
                first_hearing_date: "2023-03-01",
                next_hearing_date: "2023-04-15",
                case_stage: "Evidence",
                court_number_and_judge: "Court 2, Judge Sarah Wilson",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "ABC Corporation",
                advocate: "Adv. Amit Shah"
            },
            respondent_and_advocate_details: ["XYZ Ltd. - Adv. Meera Patel"],
            act_details: [
                {
                    under_act: "Contract Act",
                    under_section: "Section 73"
                }
            ]
        }
    },
    // ... Adding more cases with different variations
    {
        cnr_number: "MHAU010123472023",
        cnr_details: {
            case_details: {
                case_type: "Family",
                filing_number: "FAM/2023/003",
                filing_date: "2023-03-20",
                registration_number: "FM003/2023",
                registration_date: "2023-03-25"
            },
            case_status: {
                first_hearing_date: "2023-04-10",
                next_hearing_date: "2023-05-20",
                case_stage: "Mediation",
                court_number_and_judge: "Court 3, Judge Arun Kumar",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "Mrs. Sneha Patil",
                advocate: "Adv. Rekha Singh"
            },
            respondent_and_advocate_details: ["Mr. Rahul Patil - Adv. Deepak Verma"],
            act_details: [
                {
                    under_act: "Hindu Marriage Act",
                    under_section: "Section 13"
                }
            ]
        }
    }
,
    {
        cnr_number: "MHAU010123482023",
        cnr_details: {
            case_details: {
                case_type: "Property",
                filing_number: "PROP/2023/004",
                filing_date: "2023-04-05",
                registration_number: "PR004/2023",
                registration_date: "2023-04-10"
            },
            case_status: {
                first_hearing_date: "2023-05-01",
                next_hearing_date: "2023-06-15",
                case_stage: "Arguments",
                court_number_and_judge: "Court 4, Judge Priya Sharma",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "Mr. Rajesh Kumar",
                advocate: "Adv. Suresh Patel"
            },
            respondent_and_advocate_details: ["Mr. Vikram Singh - Adv. Neha Gupta"],
            act_details: [
                {
                    under_act: "Property Act",
                    under_section: "Section 54"
                }
            ]
        }
    },
    {
        cnr_number: "MHAU010123492023",
        cnr_details: {
            case_details: {
                case_type: "Consumer",
                filing_number: "CONS/2023/005",
                filing_date: "2023-05-15",
                registration_number: "CN005/2023",
                registration_date: "2023-05-20"
            },
            case_status: {
                first_hearing_date: "2023-06-01",
                next_hearing_date: "2023-07-15",
                case_stage: "Final Hearing",
                court_number_and_judge: "Court 5, Judge Amit Kumar",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "Mrs. Priya Singh",
                advocate: "Adv. Rahul Mehta"
            },
            respondent_and_advocate_details: ["XYZ Electronics - Adv. Sanjay Verma"],
            act_details: [
                {
                    under_act: "Consumer Protection Act",
                    under_section: "Section 12"
                }
            ]
        }
    },
    {
        cnr_number: "MHAU010123502023",
        cnr_details: {
            case_details: {
                case_type: "Labor",
                filing_number: "LAB/2023/006",
                filing_date: "2023-06-10",
                registration_number: "LB006/2023",
                registration_date: "2023-06-15"
            },
            case_status: {
                first_hearing_date: "2023-07-01",
                next_hearing_date: "2023-08-15",
                case_stage: "Evidence",
                court_number_and_judge: "Court 6, Judge Meera Reddy",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "Workers Union",
                advocate: "Adv. Prakash Joshi"
            },
            respondent_and_advocate_details: ["ABC Industries - Adv. Kavita Shah"],
            act_details: [
                {
                    under_act: "Industrial Disputes Act",
                    under_section: "Section 33"
                }
            ]
        }
    },
    {
        cnr_number: "MHAU010123512023",
        cnr_details: {
            case_details: {
                case_type: "Criminal",
                filing_number: "CRM/2023/007",
                filing_date: "2023-07-20",
                registration_number: "CR007/2023",
                registration_date: "2023-07-25"
            },
            case_status: {
                first_hearing_date: "2023-08-10",
                next_hearing_date: "2023-09-15",
                case_stage: "Bail Hearing",
                court_number_and_judge: "Court 7, Judge Rakesh Singh",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "State of Maharashtra",
                advocate: "Adv. Deepak Kumar"
            },
            respondent_and_advocate_details: ["Mr. Anil Sharma - Adv. Rohit Verma"],
            act_details: [
                {
                    under_act: "Indian Penal Code",
                    under_section: "Section 420"
                }
            ]
        }
    },
    {
        cnr_number: "MHAU010123522023",
        cnr_details: {
            case_details: {
                case_type: "Civil",
                filing_number: "CIV/2023/008",
                filing_date: "2023-08-05",
                registration_number: "CV008/2023",
                registration_date: "2023-08-10"
            },
            case_status: {
                first_hearing_date: "2023-09-01",
                next_hearing_date: "2023-10-15",
                case_stage: "Pre-trial",
                court_number_and_judge: "Court 8, Judge Anjali Desai",
                decision_date: null,
                nature_of_disposal: null
            },
            petitioner_and_advocate_details: {
                petitioner: "Mr. Sanjay Patel",
                advocate: "Adv. Nisha Shah"
            },
            respondent_and_advocate_details: ["Mrs. Rekha Patel - Adv. Vikram Mehta"],
            act_details: [
                {
                    under_act: "Civil Procedure Code",
                    under_section: "Order 7 Rule 11"
                }
            ]
        }
    }
];
// Function to create cases
async function createCases() {
    try {
        await Case.insertMany(dummyCases);
        console.log('Successfully inserted all cases');
    } catch (error) {
        console.error('Error creating cases:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
createCases();
