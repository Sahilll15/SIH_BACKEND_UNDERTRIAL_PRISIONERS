const express = require('express')
const router = express.Router()

const { createUser } = require('../controllers/admin.controllers')


router.post('/createUser', createUser)

module.exports = createUser