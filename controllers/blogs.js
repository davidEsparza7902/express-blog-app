const Blog = require('../models/blog')

const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user
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
    

    const blog = new Blog({
        title: body.title,
        likes: body.likes,
        url: body.url,
        author: body.author,
        user: user.id
    })
    const result = await blog.save()
    
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.get('/:id', async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (blog)
        res.json(blog)
    else
        res.status(404).end()
})

blogRouter.delete('/:id', userExtractor, async(req, res) =>{
    const token = req.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id){
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (blog.user.toString() !== user.id.toString())
        return res.status(401).json({ error: 'unauthorized user' })

    await Blog.findByIdAndDelete(req.params.id)
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== req.params.id.toString())
    await user.save()

    res.status(204).end()
})

blogRouter.put('/:id', userExtractor, async (request, response) => {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== user.id.toString())
        return response.status(401).json({ error: 'unauthorized user' })

    const body = request.body
    const blogToUpdate = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        blogToUpdate, 
        { new: true }
    )
    response.json(updatedBlog)
})

module.exports = blogRouter