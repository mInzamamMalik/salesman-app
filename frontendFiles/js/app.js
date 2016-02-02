// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
    angular.module('starter', ['ionic', 'home', 'signup', 'login' , 'adminDashboard'])


        .controller("appController", ['$scope', appController])


        .config(function ($urlRouterProvider, $stateProvider) {

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
                })
        });


    function appController($scope) {

    }


})();







