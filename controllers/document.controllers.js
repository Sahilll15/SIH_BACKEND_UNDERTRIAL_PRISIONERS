const { Document } = require('../models/documentsModels');
const { Prisioner } = require('../models/prisionerModels');
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
    try {
        const { prisionerId: userId } = req.params;
        const { title, type, description, tags } = req.body;

        // Validate required fields
        if (!userId || !title || !type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title and type are required'
            });
        }

        // Check if file is provided
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
        await fs.mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const fileExtension = path.extname(req.file.originalname);
        const fileKey = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        const filePath = path.join(uploadDir, fileKey);

        // Save file to disk
        await fs.copyFile(req.file.path, filePath);

        // Generate document URL from filepath
        const relativePath = filePath.split('uploads')[1]; // Get relative path after 'uploads'
        const documentUrl = `http://localhost:8000/uploads${relativePath}`;

        // Create document record
        const newDocument = await Document.create({
            title,
            type,
            description: description || '',
            tags: tags || '',
            document: documentUrl,
            userId
        });

        // Add document reference to prisoner's documents array
        const prisoner = await Prisioner.findById(userId);
        if (prisoner) {
            prisoner.documents = prisoner.documents || [];
            prisoner.documents.push(newDocument._id);
            await prisoner.save();
        }

        // Cleanup temporary file
        await fs.unlink(req.file.path);

        return res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: {
                id: newDocument._id,
                title: newDocument.title,
                type: newDocument.type,
                description: newDocument.description,
                tags: newDocument.tags,
                document: newDocument.document,
                createdAt: newDocument.createdAt
            }
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({
            success: false,
            message: 'Error uploading document',
            error: error.message
        });
    }
};


const getDocuments = async (req, res) => {
    try {
        const { prisionerId } = req.params;

        if (!prisionerId) {
            return res.status(400).json({
                success: false,
                message: 'Prisoner ID is required'
            });
        }

        const documents = await Document.find({ userId: prisionerId })
            .select('title type description tags document createdAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Documents retrieved successfully',
            documents: documents.map(doc => ({
                id: doc._id,
                title: doc.title,
                type: doc.type,
                description: doc.description,
                tags: doc.tags,
                document: doc.document,
                createdAt: doc.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching documents',
            error: error.message
        });
    }
}

const deleteDocument = async (req, res) => {
    try {
        const { id, prisionerId } = req.params;

        // Find the document
        const doc = await Document.findById(id);
        if (!doc) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check if the document belongs to the prisoner
        if (!doc.userId.equals(prisionerId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this document'
            });
        }

        // Delete the file from disk
        try {
            // Extract the file path from URL
            const filePath = doc.document.replace('http://localhost:8000', '');
            const fullPath = path.join(__dirname, '..', filePath);
            await fs.unlink(fullPath);
        } catch (err) {
            console.error('Error deleting file:', err);
            // Continue with document deletion even if file deletion fails
        }

        // Remove document reference from prisoner's documents array
        const prisoner = await Prisioner.findById(prisionerId);
        if (prisoner && prisoner.documents) {
            prisoner.documents = prisoner.documents.filter(docId => !docId.equals(id));
            await prisoner.save();
        }

        // Delete the document record
        await Document.deleteOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting document',
            error: error.message
        });
    }
};


const getDocumentsByPrisonerId = async (req, res) => {
    try {
        const { prisionerId } = req.params;
        
        if (!prisionerId) {
            return res.status(400).json({
                success: false,
                message: "Prisoner ID is required"
            });
        }

        // Find the prisoner by ID
        const prisoner = await Prisioner.findById(prisionerId).populate('documents');
        
        if (!prisoner) {
            return res.status(404).json({
                success: false,
                message: "Prisoner not found"
            });
        }

        // If prisoner has no documents
        if (!prisoner.documents || prisoner.documents.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No documents found for this prisoner",
                documents: []
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Documents retrieved successfully",
            documents: prisoner.documents
        });

    } catch (error) {
        console.error("Error fetching prisoner documents:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching documents",
            error: error.message
        });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    getDocumentsByPrisonerId
};
