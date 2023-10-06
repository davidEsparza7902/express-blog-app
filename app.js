const cors = require('cors')
const express = require('express')
require('express-async-errors')

const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogRouter = require ('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(()=>{
    logger.info('connected to MongoDB')
}).catch((e)=>{
    logger.info('could not connect', e)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json()) // Parse JSON requests before requestLogger
app.use(middleware.requestLogger)

app.use('/api/blogs',blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app