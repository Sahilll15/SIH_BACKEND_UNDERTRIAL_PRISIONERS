const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['prisoner', 'lawyer', 'governor']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['prisoner', 'lawyer', 'governor']
    },
    type: {
        type: String,
        required: true,
        enum: ['CASE_UPDATE', 'HEARING_DATE', 'DOCUMENT_ADDED', 'CASE_STATUS_CHANGE', 'LAWYER_ASSIGNED', 'GENERAL']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedCase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'case',
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Notification = mongoose.model('notification', notificationSchema);

module.exports = { Notification };
