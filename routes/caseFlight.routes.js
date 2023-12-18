const express = require('express')

const router = express.Router()

const { createCaseFightRequest } = require('../controllers/caseFight.controller')


router.post('/createCaseFight', createCaseFightRequest)

module.exports = router