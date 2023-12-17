const mongoose = require('mongoose')

const firModel = mongoose.Schema({
    accusedName: {
        type: String,
        required: true
    },
    accusedAge: {
        type: Number,
        required: true
    },
    accusedAddress: {
        type: String,
        required: true
    },
    placeOfOccurence: {
        type: String,
        required: true
    },
    accusedContact: {
        type: Number,
        required: true
    },
    accusedGender: {
        type: String,
        required: true
    },

    firDate: {
        type: Date,
        required: true
    },
    firPlace: {
        type: String,
        required: true
    },
    firDescription: {
        type: String,
        required: true
    },
    PoliceStation: {
        type: String,
        required: true
    },
    policeName: {
        type: String,
        required: true
    },
    sections: [
        {
            type: String,
            required: true
        }
    ],
    informer: {
        type: String,

    },
    informerAddress: {
        type: String,

    },


})


const Fir = mongoose.model('Fir', firModel)

module.exports = {
    Fir
}