const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')
const BlogRouter = require ('./controllers/blogs')

const mongoUrl = config.MONGODB_URI

logger.info('connecting')
mongoose.connect(mongoUrl).then(()=>{
    logger.info('connected to MongoDB')
}).catch((e)=>{
    logger.info('could not connect', e)
})

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/blogs',BlogRouter)

module.exports = app