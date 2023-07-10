const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const port = process.env.PORT || 8888
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'welcome to our chat app'))
        socket.broadcast.to(user.room).emit('message', generateMessage("Amin", `${user.username} has join the room`))
        callback()

    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profane words not allowed')
        }
        io.to(getUser(socket.id).room).emit('message', generateMessage(getUser(socket.id).username, message))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage("Amin", `${user.username} has left the room`))
        }
    })
    socket.on('sendLocation', (currentLocation, callback) => {
        io.to(getUser(socket.id).room).emit('locationMessage', generateLocationMessage(getUser(socket.id).username, `https://google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`))
        callback()
    })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))