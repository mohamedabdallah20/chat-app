const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8888
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('new websocket connection')
    socket.emit('message','welcome to our chat app')
    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })    
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))