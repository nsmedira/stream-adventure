'use strict'
let file = process.argv[2]
const fs = require('fs')
fs.createReadStream(file).pipe(process.stdout)