const {describe, expect, test} = require('@jest/globals')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const helper = require('./blog_test_helper')
const app = require('../app')
const api = supertest(app)

describe ('blogApi', () =>{
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.blogs)
    })
    test('the connection works', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body.map(blog => blog)
        expect(blogs[0]['id']).toBeDefined()
    })
    
    test('when we make an HTTP POST request, we create a new blog', async () => {
        let blogs = await helper.getBlogs()
        const beforeLength = blogs.length
        const response = await api.post('/api/blogs').send(helper.blogDummy)
        const savedBlog = response.body
        blogs = await helper.getBlogs()

        expect(blogs.length).toBe(beforeLength+1)
        expect(blogs[blogs.length-1]).toEqual(savedBlog)
    })

    test('when we make an HTTP POST request, if the likes is missing in the body, then set the value to 0', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutLikes)
        const savedBlog = response.body
        expect(savedBlog['likes']).toBeDefined()
        expect(savedBlog['likes']).toBe(0)
    })

    test('when we make an HTTP POST request, if the title is missing in the body, then return 400', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl)
        expect(response.status).toBe(400)
    })
    test('when we make an HTTP POST request, if the url is missing in the body, then return 400', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl)
        expect(response.status).toBe(400)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})
