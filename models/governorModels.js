const mongoose = require('mongoose');

const governorModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    modifiedCases: [{
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Case'
        },
        modifiedDate: {
            type: Date,
            default: Date.now
        },
        action: {
            type: String
        },
        comment: {
            type: String
        }
    }]
}, {
    timestamps: true
});

const Governor = mongoose.model('Governor', governorModel);

module.exports = { Governor };
