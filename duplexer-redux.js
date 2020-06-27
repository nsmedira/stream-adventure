'use strict'

const duplexer = require('duplexer2')
const through = require('through2')

module.exports = function (counter) {
    var counts = {}
    return duplexer(
        { writableObjectMode: true },
        through({objectMode: true}, write, end), 
        counter
    )

    function write (object, encoding, next) {
        var country = object.country
        var count = counts[country] || 0
        counts[country] = count + 1
        next()
    }

    function end () {
        counter.setCounts(counts)
        counts = {}
    }
}