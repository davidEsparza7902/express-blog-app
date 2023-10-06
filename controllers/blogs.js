const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (!body['likes'])
        body['likes'] = 0
    try{
        if (!body['title']){
            const error = new Error('title is missing')
            error.name = 'ValidationError'
            throw error
        }
        if (!body['url']){
            const error = new Error('url is missing')
            error.name = 'ValidationError'
            throw error
        }
    } catch(error){
        next(error)
    }
    

    const blog = new Blog(body)
    
    const result = await blog.save()
    response.status(201).json(result)
})
module.exports = blogRouter