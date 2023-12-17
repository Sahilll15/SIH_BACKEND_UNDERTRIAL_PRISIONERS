const mongoose = require('mongoose')

const caseFightSchema = new mongoose.Schema({
    accused: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisioner'
    },
    lawyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisioner'
    },
    Accepted: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})


const caseFight = mongoose.model('caseFight', caseFightSchema);

module.exports = {
    caseFight
}

