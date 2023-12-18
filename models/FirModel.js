const mongoose = require('mongoose')

const firModel = mongoose.Schema({
    FirNumber: {
        type: Number
    },
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
        name: {
            type: String
        },
        address: {
            type: String
        },
        contactNumber: {
            type: Number
        }
    },

})
const Fir = mongoose.model('Fir', firModel)

module.exports = {
    Fir
}