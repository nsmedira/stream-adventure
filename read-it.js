'ust strict'

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