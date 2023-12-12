const express = require('express')
const app = express()
const cors = require('cors')
const caseRoutes = require('./routes/case.routes')
const PrisionerRoutes = require('./routes/priosioner.routes')
const mongoose = require('mongoose')
const mongoUrl = 'mongodb://localhost:27017/SIH'

mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to database')
}).catch((error) => {
    console.log('Error connecting to database')
})

app.use(express.json())

app.use(cors())

// Middleware to log the URL
app.use((req, res, next) => {
    console.log(`Accessed URL: ${req.url}`)
    next()
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})

app.use('/api/v1/case', caseRoutes)
app.use('/api/v1/priosioner', PrisionerRoutes)
