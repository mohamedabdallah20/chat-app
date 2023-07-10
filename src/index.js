const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {generateMessage,generateLocationMessage} = require('./utils/messages')


const port = process.env.PORT || 8888
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('new websocket connection')
    socket.emit('message', generateMessage('welcome to our chat app'))
    socket.broadcast.emit('message', generateMessage("new user joined!"))
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profane words not allowed')
        }
        io.emit('message', generateMessage(message))
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('a user leaved'))
    })
    socket.on('sendLocation', (currentLocation,callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`))
        callback()
    })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))