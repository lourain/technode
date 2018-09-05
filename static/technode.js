var messages = []
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
    var socket = io();
    return {
        on:function (eventName,callback) {
            socket.on(eventName,function () {
                var args = arguments
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                })
            })
        },
        emit:function (eventName,data,callback) {
            socket.emit(eventName,data,function () {
                var args = arguments
                $rootScope.$apply(function () {
                    if(callback){
                        callback.apply(socket,args)
                    }
                })
            })
        }
    }    
})