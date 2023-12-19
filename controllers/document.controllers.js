const { Document } = require('../models/documentsModels');
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
const AWS = require('aws-sdk');
require('dotenv').config();


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

const s3 = new AWS.S3();

const uploadDocument = async (req, res) => {
    const { name, document } = req.body;
    try {
        const { userId } = req.user || {};
        console.log(userId);

        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }

        const newDocument = await Document.create({
            name: name,
            userId: userId,
        }).catch(error => {
            console.error('Error creating new document:', error);
            throw error;
        });

        if (!req.file) {
            return res.status(400).json({
                error: 'No file provided',
            });
        }

        const file = req.file;
        console.log('file', file);
        const fileKey = Date.now() + '-' + file.originalname;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: await fs.readFile(file.path),
            ContentType: file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();

        console.log('uploadResult', uploadResult);

        newDocument.document = uploadResult.Location;
        await newDocument.save();

        // Cleanup temporary file
        await fs.unlink(file.path);

        res.status(200).json({
            message: 'New document added',
            document: newDocument,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
        });
    }
};


const getDocuments = async (req, res) => {
    try {
        const { userId } = req.user;



        const docs = await Document.find({ userId: userId });

        res.status(200).json({ docs: docs })
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error.message })
    }
}

const deleteDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const { userId } = req.user;

        const doc = await Document.findById(id);

        if (!doc) {
            res.status(404).json({ message: "Document not found" });
            return;
        }

        if (!doc.userId.equals(userId)) {
            console.log('doc.userId', doc.userId);
            console.log('userId', userId);
            res.status(401).json({ message: "You are not authorized to delete this document" });
            return;
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path.basename(doc.document)
        };

        await s3.deleteObject(params).promise();
        await Document.deleteOne({ _id: id });
        res.status(200).json({ message: "Document deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument
};
