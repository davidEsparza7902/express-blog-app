const info = (...str) => {
    if (process.env.NODE_ENV !== 'test')
        console.log(...str)
}
const error = (...str) => {
    if (process.env.NODE_ENV !== 'test')
        console.log(...str)
}

module.exports = { 
    info,
    error
}