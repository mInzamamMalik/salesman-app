// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])


.config(function($urlRouterProvider , $stateProvider){

  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state("home",{
        url : "/home",
        templateUrl : "views/home/home.html"
      })
    .state("login",{
        url : "/login",
        templateUrl : "views/login/login.html"
      })


    .state("signup",{
        url : "/signup",
        templateUrl : "views/signup/signup.html"
      })


});


