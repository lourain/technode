angular.module('technodeApp', ['ngRoute'])
    .run(function ($window,$rootScope,$http,$location) {
        $http({
            url:"/api/validate",
            method:'GET',
        })
            .then(function (user) {
                $rootScope.me = user
                $location.path('/')
            })
            .catch(function (data) {
                $location.path('/login')
            })
    })