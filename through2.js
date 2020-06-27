'use strict'

const through = require('through2')
const stream = through(write, end)

process.stdin.pipe(stream).pipe(process.stdout)

function write ( buffer, encoding, next ) {
    this.push(buffer.toString().toUpperCase())
    next()
}

function end (done) {
    done()
}