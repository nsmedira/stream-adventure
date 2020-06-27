# My Solutions to stream-adventure nodeschool workshop

## 1. Beep Boop

```javascript
console.log('beep boop')
```

## 2. Meet Pipe

```javascript
'use strict'
let file = process.argv[2]
const fs = require('fs')
fs.createReadStream(file).pipe(process.stdout)
```

## 3. Input Output

```javascript
'ust strict'
process.stdin.pipe(process.stdout)
```

## 4. Read It

### My Solution

```javascript
'use strict'

// you will receive the content to add to your stream from first command line argument
let content = process.argv[2]

// implement a readable stream
const { Readable } = require('stream')
const myStream = new Readable({})
myStream.push(content)

// initiate a new stream instance from your implementation
myStream._read = () => {}

// pipe to process.stdout
myStream.pipe(process.stdout)
```
### Official Solution

```javascript
const { Readable } = require('stream')

class ReadableStream extends Readable {
    constructor (content, options = {}) {
        super(options)
        this.content = content
    }

    _read (size) {
        if (!this.content) return this.push(null)

        this.push(this.content.slice(0, size))
        this.content = this.content.slice(size)
    }
}

const stream = new ReadableStream(process.argv[2])
stream.pipe(process.stdout)
```

## 5. Transform

```javascript
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
```

## 6. Lines

```javascript
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
```

## 7. Concat

### My Solution

```javascript
'use strict'

const concat = require('concat-stream')

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
```

### Official Solution

```javascript
const concat = require('concat-stream')
    
process.stdin.pipe(concat(function (src) {
  const s = src.toString().split('').reverse().join('')
  process.stdout.write(s)
}))
```

## 8. HTTP Server

```javascript
'use strict'

const http = require('http')
const fs = require('fs')
const through = require('through2')

const stream = through(write, end)

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
```

## 9. HTTP Client

```javascript
const { request } = require('http')

const options = { method: 'POST' }

const req = request('http://localhost:8099/', options, (res) => {
    // DO SOMETHING WITH THE RESPONSE
    res.pipe(process.stdout)
})

process.stdin.pipe(req)
```

## 10. Websockets

```javascript
'use strict'

const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:8099')
const stream = WebSocket.createWebSocketStream(ws)

let string = 'hello\n'
stream.pipe(process.stdout)
stream.write(string)
```

## 11. HTML Stream

```javascript
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
```

## 12. Duplexer

```javascript
'use strict'

const { spawn } = require('child_process')
const duplexer = require('duplexer2')

module.exports = function (cmd, args) {
    // spawn the process and return a single stream
    var child = spawn(cmd, args)

    // joining together the stdin and stdout here
    return duplexer(child.stdin, child.stdout)

}
```

## 13. Duplexer Redux

```javascript
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
```

## 14. Combiner

```javascript
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
```

## 15. Crypt

```javascript
'use strict'

const crypto = require('crypto')
const stream = crypto.createDecipheriv('aes256', process.argv[2], process.argv[3])
process.stdin.pipe(stream).pipe(process.stdout)
```

## 16. Secretz

```javascript
'use strict'

const crypto = require('crypto')
const zlib = require('zlib')
const { Parse } = require('tar')
const concat = require('concat-stream')

let algorithm = process.argv[2]
let cipher = process.argv[3]
let init = process.argv[4]

const stream = crypto.createDecipheriv(algorithm, cipher, init)

let parser = new Parse();
parser.on('entry', (e) => {

    // the critical problem was that we were returning if the type didn't equal 'file' but we were not resuming
    if (e.type !== 'File') return e.resume();

    var h = crypto.createHash('md5', { encoding: 'hex' })

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
```