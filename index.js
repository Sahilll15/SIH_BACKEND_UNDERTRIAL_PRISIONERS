const express = require('express')
const app = express()
const cors = require('cors')
const caseRoutes = require('./routes/case.routes')
const PrisionerRoutes = require('./routes/priosioner.routes')
const DocumentRoutes = require('./routes/document.routes')
const FirRoutes = require('./routes/Fir.routes')
const caseFightRoutes = require('./routes/caseFlight.routes')
const adminRoutes = require('./routes/admin.routes')
const lawyerRoutes = require('./routes/lawyer.routes')
const mongoose = require('mongoose')
require('dotenv').config()


// const mongoUrl = process.env.mongoUrl
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
app.use('/api/v1/document', DocumentRoutes)
app.use('/api/v1/fir', FirRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/caseFight', caseFightRoutes)
app.use('/api/v1/lawyer', lawyerRoutes)












