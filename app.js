var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)

var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/static')))
app.use(function (req, res) {
    res.sendFile(path.join(__dirname, './static/index.html'))
})

var messages = []
io.on('connection',function (socket) {
    socket.on('getAllMessages', function () {
        console.log(messages);
        socket.emit('allMessages', messages)
    })
    socket.on('createMessage', function (message) {
        messages.push(message)
        io.emit('messageAdded', message)
    })
})



http.listen(port, function () {
    console.log('technode is on port' + port + '!');

})