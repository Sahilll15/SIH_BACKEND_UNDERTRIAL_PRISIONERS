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
    }

})


const Prisioner = mongoose.model('Prisioner', prisionerModel)

module.exports = {
    Prisioner
}


