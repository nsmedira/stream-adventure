'use strict'

const crypto = require('crypto')
const stream = crypto.createDecipheriv('aes256', process.argv[2], process.argv[3])
// stream.pipe(process.stdout)
process.stdin.pipe(stream).pipe(process.stdout)