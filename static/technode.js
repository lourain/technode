var messages = []
var socket = io();
socket.on('connected', function () {
    console.log('you are connected');
    socket.on('getAllMessages', function () {
        socket.emit('allMessages', message)
    })
    socket.on('createMessage', function (message) {
        messages.push(message)
        io.emit('messageAdded', message)
    })

})

angular.module('technodeApp',[])
angular.module('technodeApp').factory('socket',function ($rootScope) {
    
})