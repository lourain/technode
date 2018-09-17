angular.module('technodeApp')
    .controller('RoomCtrl', function ($scope, socket) {
        socket.on('roomData',function (room) {
            $scope.room = room
            console.log(room);
            
        })
        $scope.messages = []
        socket.emit('getAllMessages')
        socket.on('allMessages', function (messages) {
            $scope.messages = messages
        })
        socket.on('messageAdded', function (message) {
            $scope.messages.push(message)
        })
        socket.emit('getRoom')
    })