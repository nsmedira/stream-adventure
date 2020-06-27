'use strict'

const trumpet = require('trumpet')
const tr = trumpet()

const through = require('through2')

process.stdin.pipe(tr).pipe(process.stdout)

function write (buffer, encoding, next) {
    this.push(buffer.toString().toUpperCase())
    next()
}

function end (done) {
    done()
}

const stream = tr.select('.loud').createStream()
stream.pipe(through(write, end)).pipe(stream)