const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body['likes'])
        body['likes'] = 0

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

    const blog = new Blog(body)

    const result = await blog.save()
    response.status(201).json(result)
})

blogRouter.get('/:id', async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog)
        res.json(blog)
    else
        res.status(404).end()
})

blogRouter.delete('/:id', async(req, res) =>{
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        blog, 
        { new: true }
    )
    response.json(updatedBlog)
})

module.exports = blogRouter