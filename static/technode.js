angular.module('technodeApp', ['ngRoute'])
    .run(function ($window,$rootScope,$http,$location) {
        $http({
            url:"/api/validate",
            method:'GET',
        })
            .then(function (user) {
                console.log(user);
                
                $rootScope.me = user
                $location.path('/')
            })
            .catch(function (data) {
                $location.path('/login')
            })
        $rootScope.logout = function () {
            $http({
                url:'/ajax/logout',
                method:"GET"
            })
                .then(function () {
                    $rootScope.me = null
                    $location.path('/login')
                })
        }
        $rootScope.$on('login',function (evt,me) {
            $rootScope.me = me
        })
    })