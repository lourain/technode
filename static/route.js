angular.module('technodeApp')
    .config(function ($routeProvider,$locationProvider) {
        // $locationProvider.html5Mode(true)
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