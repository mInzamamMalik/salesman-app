/**
 * Created by 205 on 1/28/2016.
 */
(function () {

    angular.module("login", [])

        .controller("loginController", ['$scope', '$http', '$state', '$ionicHistory', 'unversalFunctionsService', loginController]);


    function loginController($scope, $http, $state, $ionicHistory, unversalFunctionsService) {

        //unversalFunctionsService.isLoggedIn();

        $scope.loginObject = {};/////this is an empty object for store login information


        $scope.doLogin = function () {/////////////////doLogin start here/////////////////////////////////////

            unversalFunctionsService.showLoading("Singing in...");//show loading screen

            $http({///////////send login request to server with login information in body
                method: "post",
                url: unversalFunctionsService.url + "/v1/login",

                // this is login information pattern which is required by api
                //  {
                //    email : "string",
                //    password : "string"
                //
                //  }
                data: {
                    email: $scope.loginObject.email,
                    password: $scope.loginObject.password
                }

            }).then(
                function (response) {

                    if (response.data.logedIn) {


                        console.log(response.data);

                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("uid", response.data.uid);
                        localStorage.setItem("email", response.data.email);
                        localStorage.setItem("photoUrl", response.data.photoUrl);

                        /*
                         disableAnimate: Do not animate the next transition.
                         disableBack: The next view should forget its back view, and set it to null.
                         historyRoot: The next view should become the root view in its history stack.
                         */


                        if (response.data.isAdmin) { // it means user is loged in

                            unversalFunctionsService.hideLoading();

                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: true
                            });
                            $state.go("adminDashboard", {}, {reload: true});

                        } else if (!response.data.isAdmin) {
                            unversalFunctionsService.hideLoading();

                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: true
                            });
                            $state.go("salesmanDashboard", {}, {reload: true});//this dash board is not yet created
                        }


                    } else {
                        unversalFunctionsService.hideLoading();
                        console.log(response.data);
                        unversalFunctionsService.showAlert("Login Failed !!", response.data.message);

                    }

                },
                function (error) {
                    console.log(error);
                    unversalFunctionsService.hideLoading();
                    unversalFunctionsService.showAlert("Login Failed !!", "check your email & password or contact support if not resolved ");

                }
            );

        };/////////////dologin ended here////////////////////////////


    }/////controller ended here//////////////////////////

})();








