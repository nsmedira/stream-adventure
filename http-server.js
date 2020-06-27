'use strict'

const http = require('http')
const fs = require('fs')
const through = require('through2')

// STREAM A FILE TO THE RESPONSE OBJECT
// const server = http.createServer((req, res) => {
//     fs.createReadStream('file.txt').pipe(res)
// })

const stream = through(write, end)

// STREAM A REQUEST TO POPULATE A FILE WITH DATA
// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         req.pipe(fs.createWriteStream('post.txt'))
//     }
//     res.end('beep boop\n')
// })

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        req.pipe(stream).pipe(res)
    }
})

function write (buffer, encoding, next) {
    this.push(buffer.toString().toUpperCase())
    next()
}

function end (done) {
    done()
}

server.listen(process.argv[2])