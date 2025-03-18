const mongoose = require('mongoose')

const prisionerModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String,

    },
    phoneNumber: {
        type: Number,
        required: true
    },
    type: {
        type: String
    },
    addharCard: {
        type: String
    },
    cases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    }],
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents'
    }]
})


const Prisioner = mongoose.model('Prisioner', prisionerModel)

module.exports = {
    Prisioner
}


