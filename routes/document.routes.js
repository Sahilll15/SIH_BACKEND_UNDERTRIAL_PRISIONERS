const express = require('express')
const router = express.Router()


const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/document.controllers')
const { validateToken } = require('../middlewares/validateToken')
const { upload } = require('../middlewares/upload')

router.post('/upload', validateToken, upload.single('docs'), uploadDocument)
router.get('/getDocuments', validateToken, getDocuments)
router.delete('/deleteDocument/:id', validateToken, deleteDocument)





module.exports = router

