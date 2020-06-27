const combine = require('stream-combiner')
const through = require('through2')
const split = require('split')
const zlib = require('zlib')

module.exports = function () {

    var currentGenre ;

    // SUPPLY COMBINE A LIST OF STREAMS. THE FIRST IS WRITABLE AND THE LAST IS READABLE
    return combine(

        // SPLIT OUR WRITTEN INPUT
        split(),

        // read newline-separated json, group books into genres,
        through(write, end),

        // then gzip the output
        zlib.createGzip()

    )

    function write (line, encoding, callback) {

        if ( line.length === 0 ) return callback()

        // read newline-separated json,
        // 'line' is a buffer. we can pass 'line' to JSON.parse() to convert it into a JSON object, and return to 'row'
        var row = JSON.parse(line)

        // group books into genres,
        if (row.type === 'genre') {

            // test to see if currentGenre has a value
            if (currentGenre) {

                // if currentGenre has a value, pass currentGenre object into JSON.stringify(). append a new line and push into the stream pipeline
                this.push(JSON.stringify(currentGenre) + '\n')

            } else {
                // if currentGenre is empty, we haven't come across a json line with type = 'genre'
            }

            // set currentGenre object. name = genre name in current row; books is empty array (all subsequent json objects will be books belonging to this genre, until we hit a new json row with type = 'genre')
            currentGenre = { name: row.name, books: []}

        // if the row type is not 'genre', test for whether it is of type 'book'
        } else if ( row.type === 'book' ) {

            // if it is a book row, push the value of the 'name' key into the books array
            currentGenre.books.push(row.name)
        }

        callback()

    }

    function end (done) {

        // we will have one leftover, un-pushed json object after the input ends
        if (currentGenre) {

            // push the string of currentGenre JSON and a new line into the stream
            this.push(JSON.stringify(currentGenre) + 
            '\n')
        }
        done()
    }

}