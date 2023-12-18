const mongoose = require('mongoose')

const documentModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    document: {
        type: String,

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prisioner'
    }
})



const Document = mongoose.model('Documents', documentModel)

module.exports = {
    Document
}


