const {describe, expect, test} = require('@jest/globals')
const mongoose = require('mongoose')
const supertest = require('supertest')

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_test_helper')
const app = require('../app')
const api = supertest(app)

const getToken = async (user) => {
    const response = await api.post('/api/login').send({
        username: user['username'],
        password: user['password']
    })
    return response.body['token']
}
describe ('when there is initially some blogs saved', () =>{
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.userDummy)
        const token = await getToken(helper.userDummy)
        for (let blog of helper.initialBlogs){
            await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blog)
        }
    })
    test('the blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    }, 100000)
    
    test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body.map(blog => blog)
        expect(blogs[0]['id']).toBeDefined()
    })
}, 100000)

describe('when we add a blog', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.userDummy)
        const token = await getToken(helper.userDummy)
        for (let blog of helper.initialBlogs){
            await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blog)
        }
    }, 100000)
    test ('we require the token', async () => {
        const response = await api
            .post('/api/blogs')
            .send(helper.blogDummy)
        expect(response.status).toBe(401)
    })

    test ('the length increases by 1', async () =>{
        const beforeLength = helper.initialBlogs.length
        const token = await getToken(helper.userDummy)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.blogDummy)
        
        const blogs = await helper.getBlogs()
        expect(blogs.length).toBe(beforeLength+1)
    })

    test('the saved blog is equal to the sended blog', async () => {
        const token = await getToken(helper.userDummy)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.blogDummy)
        const savedBlog = response.body
        savedBlog['user'] = savedBlog['user'].toString()

        const user = await User.findOne({username: helper.userDummy['username']})

        expect(savedBlog).toEqual({
            ...helper.blogDummy,
            user: user.id.toString(),
            id: savedBlog['id']
        })
    })

    test('when the likes is missing in the body, then set the value to 0', async () => {
        const token = await getToken(helper.userDummy)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.blogWithoutLikes)
    
        const savedBlog = response.body
        expect(savedBlog['likes']).toBeDefined()
        expect(savedBlog['likes']).toBe(0)
    })

    test('when the title is missing in the body, then return 400', async () => {
        const token = await getToken(helper.userDummy)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.blogWithoutTitleAndUrl)
    
        expect(response.status).toBe(400)
    })

    test('when the url is missing in the body, then return 400', async () => {
        const token = await getToken(helper.userDummy)

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.blogWithoutTitleAndUrl)
        expect(response.status).toBe(400)
    })
}, 100000)

describe('when we update a blog', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        await api.post('/api/users').send(helper.userDummy)

        const token = await getToken(helper.userDummy)

        for (let blog of helper.initialBlogs){
            await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blog)
        }
    }, 100000)
    // title
    test ('the title can be updated', async () => {
        const token = await getToken(helper.userDummy)

        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['title'] = 'Cage the elephant'

        const response = await api
            .put(`/api/blogs/${blogToUpdate['id']}`)
            .set('Authorization', `Bearer ${token}`)
            .send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['title']).toBe(blogToUpdate['title'])
    })
    // author
    test ('the author can be updated', async () => {
        const token = await getToken(helper.userDummy)
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['author'] = 'Alberto Esparza'
        const response = await api
            .put(`/api/blogs/${blogToUpdate['id']}`)
            .set('Authorization', `Bearer ${token}`)
            .send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['author']).toBe(blogToUpdate['author'])
    })
    // url
    test ('the url can be updated', async () => {
        const token = await getToken(helper.userDummy)
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['url'] = 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
        const response = await api
            .put(`/api/blogs/${blogToUpdate['id']}`)
            .set('Authorization', `Bearer ${token}`)
            .send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['url']).toBe(blogToUpdate['url'])
    })
    // likes
    test ('the likes can be updated', async () => {
        const token = await getToken(helper.userDummy)
        const blogs = await helper.getBlogs()
        const blogToUpdate = blogs[1]
        blogToUpdate['likes'] = 50
        const response = await api
            .put(`/api/blogs/${blogToUpdate['id']}`)
            .set('Authorization', `Bearer ${token}`)
            .send(blogToUpdate)
        const savedBlog = response.body
        expect(savedBlog['likes']).toBe(blogToUpdate['likes'])
    })
})

describe('when we delete a blog',  () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        await api.post('/api/users').send(helper.userDummy)

        const token = await getToken(helper.userDummy)

        for (let blog of helper.initialBlogs){
            await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blog)
        }
    }, 100000)
    test('the response status is 204',async () =>{
        const blogs = await helper.getBlogs()
        const blogToDelete = blogs[1]
        const token = await getToken(helper.userDummy)
    
        const response = await api
            .delete(`/api/blogs/${blogToDelete['id']}`)
            .set('Authorization', `Bearer ${token}`)
    
        expect(response.status).toBe(204)
    })
    test('the length of the blogs decreases by 1', async () => {
        const beforeLength = helper.initialBlogs.length
        let blogs = await helper.getBlogs()
        const blogToDelete = blogs[0]
        const token = await getToken(helper.userDummy)
        await api
            .delete(`/api/blogs/${blogToDelete['id']}`)
            .set('Authorization', `Bearer ${token}`)
        blogs = await helper.getBlogs()
        expect(blogs.length).toBe(beforeLength-1)

    })
}, 100000)

describe('when we add a user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const initialUsers = helper.initialUsers
        for (let user of initialUsers){
            await api.post('/api/users').send({
                username: user['username'],
                name: user['name'],
                password: user['password']
            })
        }
    }, 100000)
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

}, 100000)

describe ('when we login', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await api.post('/api/users').send(helper.userDummy)
    })
    test('the response status is 200', async () => {
        const response = await api.post('/api/login').send({username: 'david', password: '123456789'})
        expect(response.status).toBe(200)
    })
    test('the response body has a token', async () => {
        const response = await api.post('/api/login').send({username: 'david', password: '123456789'})
        expect(response.body['token']).toBeDefined()
    })
    test('the response body has a username', async () => {
        const response = await api.post('/api/login').send({username: 'david', password: '123456789'})
        expect(response.body['username']).toBeDefined()
    })
    test('the response body has a name', async () => {
        const response = await api.post('/api/login').send({username: 'david', password: '123456789'})
        expect(response.body['name']).toBeDefined()
    })

})
afterAll(async () => {
    await mongoose.connection.close()
})