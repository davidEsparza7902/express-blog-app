const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

const mongoUrl = config.MONGODB_URI
logger.info('connecting')
mongoose.connect(mongoUrl).then(()=>{
    logger.info('connected to MongoDB')
}).catch((e)=>{
    logger.info('could not connect', e)
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('holaaaaaaa')
})
app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})
module.exports = app