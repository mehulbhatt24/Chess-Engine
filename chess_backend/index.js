const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http')
require('colors');

const app = express();

app.use(cors);

const server = app.listen(5000, () => {
    console.log("app listening on port 5000".green.underline);
})

const io = socketio(server, {
    cors: {
        origin: "*"
        // origin:'*'
    }
})

let games={}

io.on('connection', (socket) => {
    console.log(`${socket.id} New connection`.blue)
    socket.on('joinRoom', ({gameid,color}) => {
        socket.join(gameid);
        games[gameid] = color
        console.log(`joined room ${gameid}`.yellow);
        const socketis = io.in(gameid).fetchSockets()
        socketis.then((value) => console.log(value))
        
        

    })
    socket.on('joinReq', (gameid) => {
        const socketis = io.in(gameid).fetchSockets()
        socketis.then((value) => {
            if (value.length == 0)
                socket.emit('joinRes', {msg:'Game does not exist'})
            else if (value.length == 2)
                socket.emit('joinRes', {msg:'Room is full'})
            else {
                socket.join(gameid)
                socket.to(gameid).emit('opponent joined')
                socket.emit('joinRes', {msg:"Joining Game",gameid:gameid,color:(games[gameid] && (games[gameid]=="black"?"white":"black"))})
                console.log(`joined room ${gameid}`.yellow);
                console.log(value.length)
            }
            // socket.join(gameid);
            // const socketis = io.in(gameid).fetchSockets()
        })
    })
    socket.on('opponent move', (move) => {
        console.log(move)
        socket.to(move.gameid).emit('move played', move);

    })
    socket.on('checkmated', ({ opponentColor, gameid }) => {
        socket.to(gameid).emit('checkmated', opponentColor)
    })
    socket.on('promotion', (move) => {
        socket.to(move.gameid).emit('promotion', move)
        console.log("emitting promotion from console - ".red)
        console.log(move)
    })
    socket.on('disconnect', () => {
        console.log("A user disconnected".red)
        // socket.leave()
    })
})
