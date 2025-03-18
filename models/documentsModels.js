const mongoose = require('mongoose')

const documentModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: {
        type: String
    },
    document: {
        type: String,
        required: true
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


