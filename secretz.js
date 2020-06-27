'use strict'

const crypto = require('crypto')
const zlib = require('zlib')
const { Parse } = require('tar')
const concat = require('concat-stream')
// const through = require('through2')

let algorithm = process.argv[2]
let cipher = process.argv[3]
let init = process.argv[4]

const stream = crypto.createDecipheriv(algorithm, cipher, init)

let parser = new Parse();
parser.on('entry', (e) => {

    // the critical problem was that we were returning if the type didn't equal 'file' but we were not resuming
    if (e.type !== 'File') return e.resume();

    var h = crypto.createHash('md5', { encoding: 'hex' })

    // e.pipe(h).pipe(concat( (hash) => {
    //     console.log(hash + ' ' + e.path)
    // }))

    // e
    //     .pipe(h)
    //     .pipe(through(
    //         (buffer) => {
    //             this.push(buffer.toString())
    //         }, 
    //         () => {
    //             this.push(' ' + e.path + '\n')
    //             this.push(null)
    //         }
    //     ))
    //     .pipe(process.stdout)

    e
        .pipe(h)
        .pipe(concat( (hash) => {
            console.log(hash + ' ' + e.path)
        }))
})

process.stdin
    .pipe(stream)
    .pipe(zlib.createGunzip())
    .pipe(parser)