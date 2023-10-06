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
        // verify that the total number of blogs in the system is increased by one.
        expect(blogs.length).toBe(beforeLength+1)
        // verify that the content of the blog post is saved correctly to the database.
        expect(blogs[blogs.length-1]).toEqual(savedBlog)
    })
    afterAll(async () => {
        await mongoose.connection.close()
    })
})
