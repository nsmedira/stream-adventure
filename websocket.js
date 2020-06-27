'use strict'

const WebSocket = require('ws')
const ws = new WebSocket('ws://localhost:8099')
const stream = WebSocket.createWebSocketStream(ws)

let string = 'hello\n'
stream.pipe(process.stdout)
stream.write(string)