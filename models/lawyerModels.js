const mongoose = require('mongoose')

const lawyerModel = new mongoose.Schema({
    name: {
        type: String,
        requied: true
    },
    email: {
        type: String,
        requied: true
    },
    password: {
        type: String,
        requied: true
    },
    phone: {
        type: String,
        requied: true
    },
    address: {
        type: String,
        requied: true
    },
    certificate: {
        type: String,
        requied: true
    },
    LicenseNumber: {
        type: String,
        requied: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    addharCard: {
        type: String,
        requied: true
    },
    cases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    }]
})

const lawyer = mongoose.model('lawyer', lawyerModel)


module.exports = { lawyer }