angular.module('technodeApp')
    .controller('MessageCreatorCtrl', function ($scope, socket) {
        $scope.newMessage = ''
        
        $scope.createMessage = function () {
            if ($scope.newMessage == '') {
                return
            }
            console.log('once');
            socket.emit('createMessage', {
                message:$scope.newMessage,
                creator:$scope.me
            })
            $scope.newMessage = ''
        }
    })
