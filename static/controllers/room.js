angular.module('technodeApp')
    .controller('RoomCtrl', function ($scope, socket) {
        socket.on('roomData',function (room) {
            $scope.room = room
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
        socket.on('online',function (user) {
            $scope.room.users.push(user);
            console.log(new Set($scope.room.users))
            
            // var exist = $scope.room.users.includes(user)
            // console.log(t);
            
            // exist ? $scope.room.users:$scope.room.users.push(user);
            
            
            // $scope.room.users = Array.from(new Set($scope.room.users.push(user))) 
            // $scope.room.users.push(user)
            // console.log(Array.from(new Set($scope.room.users.push(user))));
            
        })
        socket.on('offline',function (user) {
            _userId = user._id
            $scope.room.users = $scope.room.users.filter(function (user) {
                return user._id != _userId
            })

        })
    })