// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function () {
    angular.module('starter', ['ionic','geolocation', 'home', 'signup', 'login', 'adminDashboard', 'salesmanDashboard', 'salesmanSignup'])


        .controller("appController", ['$scope', appController])


        .config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
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
                    cache: false, // controller will terminate on state change and not keep running
                    url: "/adminDashboard",
                    templateUrl: "views/adminDashboard/adminDashboard.html",
                    controller: "adminDashboardController"
                })
                .state("salesmanSignup", {
                    url: "/salesmanSignup",
                    templateUrl: "views/salesmanSignup/salesmanSignup.html",
                    controller: "salesmanSignupController"
                })

                .state("salesmanDashboard", {
                    cache: false, // controller will terminate on state change and not keep running
                    url: "/salesmanDashboard",
                    templateUrl: "views/salesmanDashboard/salesmanDashboard.html",
                    controller: "salesmanDashboardController"
                });


            $urlRouterProvider.otherwise("/home");

            $httpProvider.interceptors.push('httpInterceptor');
        })


        .service("unversalFunctionsService", function ($state, $ionicHistory, $ionicPopup, $ionicLoading, $http) {
            var vm = this;

            //////////////////////////////////////////////////////////////////////////////////////
            this.showLoading = function (text) {
                $ionicLoading.show({
                    template: text
                });
            };
            this.hideLoading = function () {
                $ionicLoading.hide();
            };
            this.showAlert = function (title, template) {
                $ionicPopup.alert({
                    title: title,
                    template: template
                });
            };

            this.showConfirm = function (title, template , onTrue , onFalse) {


                    var confirmPopup = $ionicPopup.confirm({
                        title: title,
                        template: template

                    }).then(function(res) {
                        if(res) {
                            vm.showLoading("deleting...");
                           onTrue();
                        } else {
                            onFalse();
                        }
                    });
            };



            //////////////////////////////////////////////////////////////////////////////////////

            this.clearCredentials = function () {

                console.log("clear");
                localStorage.clear();//clear all entry of localstorage
                /*
                 disableAnimate: Do not animate the next transition.
                 disableBack: The next view should forget its back view, and set it to null.
                 historyRoot: The next view should become the root view in its history stack.
                 */
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                });
                $state.go("login", {}, {reload: true});
            };

            ///////////////////////////////////////////////////////////////////////////////
            this.notLoggedIn = function () { //recommend:this function only call if any request end with error.status==401, not on controller load
                currentView = $ionicHistory.currentStateName();

                if (currentView != "home" && currentView != "login" && currentView != "signup") {

                    vm.showAlert("Login First", "it look like you are not logged in or your session is expired");
                    localStorage.setItem("token", "");//if token is garbage or expired it is removing
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });
                    $state.go("login");
                }
            };
            //////////////////////////////////////////////////////////////////////////////////////
            this.loggedIn = function () {
                if ($ionicHistory.currentStateName() != "adminDashboard") {
                    $state.go("adminDashboard");
                }
            };

            //////////////////////////////////////////////////////////////////////////////////
            this.isLoggedIn = function () { //recommend:this function will only call on load of login-page-controller, not admindashboard

                if (localStorage.getItem("token")) {

                    console.log("checking isLoggedIn...");

                    $http.get("/v1/isLoggedIn").then(function (res) {

                        console.log("isLoggedIn response", res);
                        if (res.data.isLoggedIn) { // it means user is loged in
                            vm.loggedIn();
                        } else {
                            vm.notLoggedIn();
                        }
                    });
                }

            };
            ///////////////////////////////////////////////////////////////////////////////////////////////////


        })//service ended


        .factory("httpInterceptor", function () {
            return {
                request: function (config) {

                    //console.log("a http request is intersepted");
                    var token = localStorage.getItem("token");
                    var uid = localStorage.getItem("uid");

                    if (token) {
                        config.url = config.url + "?uid=" + uid + "&token=" + token;
                    }
                    return config;
                }
            }
        });


    function appController($scope) {

    }


})();







