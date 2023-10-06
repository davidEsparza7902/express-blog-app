const {describe, expect, test} = require('@jest/globals')
const listHelper = require('../utils/list_helper')


describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        expect(result).toBe(5)
    })
    test('when list has more than one blog, sum the values', () => {
        const result = listHelper.totalLikes(listHelper.blogs)
        expect(result).toBe(36)
    })
})
describe('favorite blog', () =>{
    test('when list has only one blog, it is the favorite', () =>{
        const result = listHelper.favoriteBlog(listHelper.listWithOneBlog)
        expect(result).toEqual(listHelper.listWithOneBlog[0])
    })
    test('when list has more than one blog, select the blog with the most likes', () =>{
        const result = listHelper.favoriteBlog(listHelper.blogs)
        expect(result).toEqual(listHelper.blogs[2])
    })
})
describe('author with the most blogs', () => {
    test('if the array is empty, returns null', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe(null)
    })
    test('if the array has only one element, return the author of  the element', () => {
        const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
        expect(result).toEqual({author: 'Edsger W. Dijkstra',blogs: 1})
    })
    test('count the number of blogs, saving the values in an object', () =>{
        const result = listHelper.mostBlogs(listHelper.blogs)
        expect(result).toEqual({author: 'Robert C. Martin',blogs: 3})
    })
})
describe('author with the most likes', () => {
    test('when the array does not have elementes, returns null', () => {
        const result = listHelper.mostLikes([])
        expect(result).toBe(null)
    })
    test('when the array has only one elements, returns its values', () => {
        const result = listHelper.mostLikes(listHelper.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })
    test('count the number of likes, saving the values in an object', () => {
        const result = listHelper.mostLikes(listHelper.blogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })

})