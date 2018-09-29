angular.module('technodeApp')
    .controller('RoomCtrl', function ($scope, socket) {
        $scope.messages = []
        socket.on('roomData', function (room) {
            $scope.room = room
            
            
        })
        socket.emit('getAllMessages')
        socket.on('allMessages', function (messages) {
            $scope.messages = messages
        })
        socket.on('messageAdded', function (message) {
            $scope.messages.push(message)
        })
        socket.emit('getRoom')
        socket.on('online', function (user) {
            console.log(user.name);
            $scope.room.users = $scope.room.users.filter(function (item) {
                return item.name != user.name
            })
            $scope.room.users.push(user);
            console.log($scope.room.users);

        })
        socket.on('offline', function (user) {
            _userId = user._id
            $scope.room.users = $scope.room.users.filter(function (user) {
                return user._id != _userId
            })

        })
    })