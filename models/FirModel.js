const mongoose = require('mongoose')

const firModel = mongoose.Schema({
    accusedName: {
        type: String,

    },
    accusedAge: {
        type: Number,

    },
    accusedAddharCard: {
        type: String,
        required: true
    },
    accusedAddress: {
        type: String,
    },
    placeOfOccurence: {
        type: String,
    },
    accusedContact: {
        type: Number,
    },
    accusedGender: {
        type: String,
    },
    firDate: {
        type: Date,

    },
    firPlace: {
        type: String,

    },
    firDescription: {
        type: String,

    },
    PoliceStation: {
        type: String,

    },
    policeName: {
        type: String,
    },
    sections: [
        {
            type: String,
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