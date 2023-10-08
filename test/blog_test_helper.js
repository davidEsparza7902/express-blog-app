const Blog = require('../models/blog')
const User = require('../models/user')
const blogWithoutTitleAndUrl = {
    author: 'David Esparza'
}
const blogWithoutLikes = {
    title: 'Business Inteligence',
    author: 'David Esparza',
    url: 'http://localhost'
}
const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]
const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }  
]

const blogDummy = {
    title: 'Business Inteligence',
    author: 'David Esparza',
    url: 'http://localhost',
    likes: 20
}
const initialUsers = [
    {
        'username': 'user1',
        'name': 'John Doe'
    },
    {
        'username': 'user2',
        'name': 'Jane Smith'
    },
    {
        'username': 'user3',
        'name': 'Michael Johnson'
    },
    {
        'username': 'user4',
        'name': 'Emily Davis'
    },
    {
        'username': 'user5',
        'name': 'David Brown'
    },
    {
        'username': 'user6',
        'name': 'Sarah Wilson'
    },
    {
        'username': 'user7',
        'name': 'Robert Anderson'
    },
    {
        'username': 'user8',
        'name': 'Jessica Martinez'
    },
    {
        'username': 'user9',
        'name': 'Daniel Taylor'
    },
    {
        'username': 'user10',
        'name': 'Jennifer Garcia'
    }
]
const userDummy = {
    username: 'david',
    name: 'David Esparza',
    password: '123456789'
}
const invalidUser = {
    username: 'da',
    name: 'David Esparza',
    password: '12'
}
const userWithoutUsername = {
    name: 'David Esparza',
    password: '123456789'
}
const userWithoutName = {
    username: 'david',
    password: '123456789'
}
const userWithShortUsername = {
    name: 'David Esparza',
    password: '123456789'
}
const userWithoutPassword = {
    username: 'david',
    name: 'David Esparza',
}
const userWithShortPassword = {
    username: 'david',
    name: 'David Esparza',
    password: '12'
}
const getBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
const getUsers = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}
module.exports = {
    listWithOneBlog,
    initialBlogs,
    blogDummy,
    blogWithoutLikes,
    blogWithoutTitleAndUrl,
    getBlogs,
    getUsers,
    userDummy,
    invalidUser,
    userWithoutUsername,
    userWithoutName,
    userWithShortUsername,
    userWithoutPassword,
    userWithShortPassword,
    initialUsers
}