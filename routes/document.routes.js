const express = require('express')
const router = express.Router()


const { uploadDocument, getDocuments, deleteDocument, getDocumentsByPrisonerId } = require('../controllers/document.controllers')
const { validateToken } = require('../middlewares/validateToken')
const { upload } = require('../middlewares/upload')

router.post('/upload/:prisionerId', upload.single('docs'), uploadDocument)
router.get('/getDocuments/:prisionerId', getDocuments)
router.delete('/deleteDocument/:id/:prisionerId', deleteDocument)
router.get('/prisoner/:prisionerId', getDocumentsByPrisonerId)





module.exports = router

