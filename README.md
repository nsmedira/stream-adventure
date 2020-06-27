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

## 11. HTML Stream

## 12. Duplexer

## 13. Duplexer Redux

## 14. Combiner

## 15. Crypt

## 16. Secretz