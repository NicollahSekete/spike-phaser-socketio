const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(`${__dirname}/client`))

var players = []

io.on('connection', (socket) => {
    console.log(socket.id + ' is connected')
    players.push({ posx: 100, posy: 450, id: socket.id })
    socket.on('updatePlayers', (data) => {
        players.forEach(player => {
            if (player.id === socket.id) {
                player.posx = data.posx
                player.posy = data.posy
            }
        })

        socket.emit('updatePlayers', players)
    })

    socket.on('starCollect', (data) => {
        console.log('im got a star!')


        socket.broadcast.emit('starCollect', data)
    })

    socket.on('disconnect', () => {
        console.log(socket.id + ' has disconnected')
        players.forEach((player, index) => {
            if (player.id === socket.id) {
                players.splice(index, 1)
            }
        })
    })


})


server.listen(3000, () => {
    console.log('listening on port 3000')
})