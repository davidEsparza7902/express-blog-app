const {describe, expect, test} = require('@jest/globals')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_test_helper')
const app = require('../app')
const api = supertest(app)


describe ('when there is initially some blogs saved', () =>{
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
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
})

describe('when we add a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    test ('the length increases by 1', async () =>{
        const beforeLength = helper.initialBlogs.length
        await api.post('/api/blogs').send(helper.blogDummy)
        const blogs = await helper.getBlogs()
        expect(blogs.length).toBe(beforeLength+1)
    })
    test('the saved blog is equal to the sended blog', async () => {
        const response = await api.post('/api/blogs').send(helper.blogDummy)
        const savedBlog = response.body
        const blogs = await helper.getBlogs()
        expect(blogs[blogs.length-1]).toEqual(savedBlog)
    })

    test('when the likes is missing in the body, then set the value to 0', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutLikes)
        const savedBlog = response.body
        expect(savedBlog['likes']).toBeDefined()
        expect(savedBlog['likes']).toBe(0)
    })

    test('when the title is missing in the body, then return 400', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl)
        expect(response.status).toBe(400)
    })

    test('when the url is missing in the body, then return 400', async () => {
        const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl)
        expect(response.status).toBe(400)
    })
})

describe('when we update a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    // title
    test ('the title can be updated', async () => {
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['title'] = 'Cage the elephant'
        const response = await api.put(`/api/blogs/${blogToUpdate['id']}`).send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['title']).toBe(blogToUpdate['title'])
    })
    // author
    test ('the author can be updated', async () => {
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['author'] = 'Alberto Esparza'
        const response = await api.put(`/api/blogs/${blogToUpdate['id']}`).send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['author']).toBe(blogToUpdate['author'])
    })
    // url
    test ('the url can be updated', async () => {
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['url'] = 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
        const response = await api.put(`/api/blogs/${blogToUpdate['id']}`).send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['url']).toBe(blogToUpdate['url'])
    })
    // likes
    test ('the likes can be updated', async () => {
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['likes'] = 50
        const response = await api.put(`/api/blogs/${blogToUpdate['id']}`).send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['likes']).toBe(blogToUpdate['likes'])
    })
})

describe('when we delete a blog',  () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    test('the response status is 204',async () =>{
        const blogs = await helper.getBlogs()
        const blogToDelete = blogs[1]
        const response = await api.delete(`/api/blogs/${blogToDelete['id']}`)
        expect(response.status).toBe(204)
    })
    test('the length of the blogs decreases by 1', async () => {
        const beforeLength = helper.initialBlogs.length
        let blogs = await helper.getBlogs()
        const blogToDelete = blogs[1]
        await api.delete(`/api/blogs/${blogToDelete['id']}`)
        blogs = await helper.getBlogs()
        expect(blogs.length).toBe(beforeLength-1)
    })
})

// Implement tests that ensure invalid users are not created and that an invalid add user operation returns a suitable status code and error message.
describe('when we add a user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    })
    test('the users length increases by 1', async () => {
        const beforeLength = helper.initialUsers.length
        await api.post('/api/users').send(helper.userDummy)
        const users = await helper.getUsers()
        expect(users.length).toBe(beforeLength+1)
    })
    test('the saved user is equal to the sended user', async () => {
        const response = await api.post('/api/users').send(helper.userDummy)
        const savedUser = response.body
        const users = await helper.getUsers()
        expect(users[users.length-1]).toEqual(savedUser)
    })
    test('when the username is missing in the body, then return 400', async () => {
        const response = await api.post('/api/users').send(helper.userWithoutUsername)
        expect(response.status).toBe(400)
    })
    test('when the username is less than 3 characters, then return 400', async () => {
        const response = await api.post('/api/users').send(helper.userWithShortUsername)
        expect(response.status).toBe(400)
    })
    test('when the password is missing in the body, then return 400', async () => {
        const response = await api.post('/api/users').send(helper.userWithoutPassword)
        expect(response.status).toBe(400)
    })
    test('when the password is less than 3 characters, then return 400', async () => {
        const response = await api.post('/api/users').send(helper.userWithShortPassword)
        expect(response.status).toBe(400)
    })

})
afterAll(async () => {
    await mongoose.connection.close()
})