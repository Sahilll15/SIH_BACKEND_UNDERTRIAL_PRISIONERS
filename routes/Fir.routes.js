const express = require('express')

const router = express.Router()

const { createFir, getFir, getFirById, getFirByUser, getFirByNumber } = require('../controllers/Fir.controllers')
const { validateToken } = require('../middlewares/validateToken')

router.post('/createFir', createFir)
router.get('/getFir', getFir)
router.get('/getFirByid/:firId', getFirById)
router.get('/getFirByUser', validateToken, getFirByUser)
router.get('/getFirByNumber/:FirNumber', getFirByNumber)



module.exports = router

