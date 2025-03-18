const express = require('express')
const router = express.Router()


const { createCase, getAllCase, getCaseByCnr, addCaseToPrisioner } = require('../controllers/case.controllers')

router.post('/create', createCase)
router.get('/getAll', getAllCase)
router.get('/getByCnr/:cnr_number', getCaseByCnr)
router.post('/addToPrisioner/:prisionerId', addCaseToPrisioner)


module.exports = router