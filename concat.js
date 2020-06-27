'use strict'

const concat = require('concat-stream')
// const through = require('through2')
// const split = require('split2')

process.stdin
    .pipe(concat( (buffer) => {
        let array = buffer.toString().split('\n')
        var blob = ''
        for ( var i = array.length - 1 ; i >= 0 ; i-- ) {

            var string = ''
            for ( var j = array[i].length - 1 ; j >= 0 ; j-- ) {
                string += array[i][j]
            }
            blob += string + '\n'
        }
        process.stdout.write(blob)
    }))