angular.module('technodeApp', ['ngRoute'])
    .run(function ($window,$rootScope,$hhtp,$location) {
        $http({
            url:"/api/validate",
            method:'GET',
        }).success(function (user) {
            $rootScope.me = user
            $location.path('/')
        }).error(function (data) {
            $location.path('/login')
        })
    })