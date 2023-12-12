const express = require('express')
const router = express.Router()


const { createCase, getAllCase, getCaseByCnr } = require('../controllers/case.controllers')

router.post('/create', createCase)
router.get('/getAll', getAllCase)
router.get('/getByCnr/:cnr_number', getCaseByCnr)


module.exports = router