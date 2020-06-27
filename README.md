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

## 8. HTTP Server

## 9. HTTP Client

## 10. Websockets

## 11. HTML Stream

## 12. Duplexer

## 13. Duplexer Redux

## 14. Combiner

## 15. Crypt

## 16. Secretz