// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
    angular.module('starter', ['ionic', 'home', 'signup', 'login' , 'adminDashboard'])


        .controller("appController", ['$scope', appController])


        .config(function ($urlRouterProvider, $stateProvider, $httpProvider) {

            $urlRouterProvider.otherwise("/home");

            $stateProvider
                .state("home", {
                    url: "/home",
                    templateUrl: "views/home/home.html",
                    controller: "homeController"
                })
                .state("login", {
                    url: "/login",
                    templateUrl: "views/login/login.html",
                    controller: "loginController"
                })


                .state("signup", {
                    url: "/signup",
                    templateUrl: "views/signup/signup.html",
                    controller: "signupController"
                })

                .state("adminDashboard", {
                    url: "/adminDashboard",
                    templateUrl: "views/adminDashboard/adminDashboard.html",
                    controller: "adminDashboardController"
                });

            $httpProvider.interceptors.push('httpInterceptor');
        })



        .factory("httpInterceptor", function(){
            return {
                request : function(config){

                    //console.log("a http request is intersepted");
                    var token = localStorage.getItem("token");
                    var uid = localStorage.getItem("uid");

                    if(token){
                        config.url = config.url + "?uid=" + uid + "&token=" + token ;
                    }
                    return config;
                }
            }
        });


        function appController($scope) {

        }


})();







