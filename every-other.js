'use strict'

const through = require('through2')
const split2 = require('split2')
const stream = through(write, end)

var i = 0

process.stdin
    .pipe(split2())
    .pipe(stream).pipe(process.stdout)

function write ( buffer, encoding, next ) {
    i++ 
    if ( i % 2 > 0 ) {
        this.push(buffer.toString().toLowerCase() + '\n')
    } else {
        this.push(buffer.toString().toUpperCase() + '\n')
    }
    next()
}

function end (done) {
    done()
}