angular.module('technodeApp')
    .config(function ($routeProvider,$locationProvider) {
        $locationProvider.html5Mode({//开启pushState
            enable:true,
            requireBase:false
        })
        $routeProvider.when('/',{
            templateUrl:'/page/room.html',
            controller:'RoomCtrl'
        }).when('/login',{
            templateUrl:'/page/login.html',
            controller:'LoginCtrl'
        }).otherwise({
            redirectTo:'/login'
        })
    })