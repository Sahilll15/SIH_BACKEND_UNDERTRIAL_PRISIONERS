const mongoose = require('mongoose');
const caseSchema = new mongoose.Schema({
    cnr_number: {
        type: String,
        required: true
    },
    cnr_details: {
        case_details: {
            case_type: String,
            filing_number: String,
            filing_date: Date,
            registration_number: String,
            registration_date: Date
        },
        case_status: {
            first_hearing_date: Date,
            next_hearing_date: Date,
            case_stage: String,
            court_number_and_judge: String,
            decision_date: Date,
            nature_of_disposal: String
        },
        petitioner_and_advocate_details: {
            petitioner: String,
            advocate: String
        },
        respondent_and_advocate_details: [String],
        act_details: [
            {
                under_act: String,
                under_section: String
            }
        ],
        subordinate_court_information_details: {},
        case_history_details: [
            {
                judge: String,
                business_on_date: Date,
                hearing_date: Date,
                purpose_of_hearing: String
            }
        ],
        interim_orders_details: [
            {
                order_number: String,
                order_date: Date
            }
        ],
        final_orders_and_judgements_details: [
            {
                order_number: String,
                order_date: Date
            }
        ],
        case_transfer_and_establishment_details: [
            {
                transfer_date: Date,
                from_court_number_and_judge: String,
                to_court_number_and_judge: String
            }
        ],
        process_details: []
    }
});

const Case = mongoose.model('Case', caseSchema);

module.exports = { Case };
