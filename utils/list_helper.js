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
const blogs = [
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

/**
 * @param {Array} blogs
 */
const totalLikes = (blogs) => {
    if (blogs.length===1)
        return blogs[0]['likes']
    return blogs.reduce((likes,elem)=>likes+elem['likes'],0)
}

/**
 * @param {Array} blogs
 */
const favoriteBlog = (blogs) =>{
    if (blogs.length === 1)
        return blogs[0]
    const maxLikes = Math.max(...blogs.map(blog=>blog.likes))
    const favorite = blogs.find(blog=>blog.likes===maxLikes)
    return favorite
}

/**
 * @param {Array} blogs
 */
const mostBlogs = blogs => {
    if (blogs.length===0)
        return null
    if (blogs.length===1)
        return {
            author: blogs[0]['author'],
            blogs: 1
        }
    const blogCounts = {}
    for (const blog of blogs){
        const author = blog.author
        if (blogCounts[author])
            blogCounts[author]++
        else
            blogCounts[author] = 1
    }
    let maxAuthor = ''
    let maxBlogs = 0
    for (const author in blogCounts){
        if (blogCounts[author]>maxBlogs){
            maxAuthor=author
            maxBlogs = blogCounts[author]
        }
    }
    return {
        author: maxAuthor,
        blogs: maxBlogs
    }
}
/**
 * @param {Array} blogs
 */
const mostLikes = (blogs) =>{
    if (blogs.length===0)
        return null
    
    if (blogs.length===1)
        return {
            author: blogs[0]['author'],
            likes: blogs[0]['likes']
        }
    
    const likeCount = {}
    for (const blog of blogs){
        const author = blog.author
        const likes = blog.likes
        if (likeCount[author])
            likeCount[author] += likes
        else
            likeCount[author] = likes
    }
    let maxAuthor = ''
    let maxLikes = 0
    for (const author in likeCount){
        if (likeCount[author]>maxLikes){
            maxAuthor=author
            maxLikes = likeCount[author]
        }
    }
    console.log(likeCount)
    return {
        author: maxAuthor,
        likes: maxLikes
    }
}
module.exports = {
    blogs,
    listWithOneBlog,
    totalLikes, 
    favoriteBlog,
    mostBlogs,
    mostLikes
}