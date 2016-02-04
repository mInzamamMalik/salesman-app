/**
 * Created by 205 on 1/28/2016.
 */
(function () {

    angular.module("login", [])

        .controller("loginController", ['$scope', '$http', '$state', '$ionicLoading', '$ionicPopup', loginController]);


    function loginController($scope, $http, $state, $ionicLoading, $ionicPopup) {


        $scope.loginObject = {};/////this is an empty object for store login information


        $scope.doLogin = function () {/////////////////doLogin start here/////////////////////////////////////

            $scope.showLoding("Singing in...");//show loading screen

            $http({///////////send login request to server with login information in body
                method: "post",
                url: "/v1/login",

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

                    if(response.data.logedIn){

                        $scope.hideLoding();

                        console.log(response.data);

                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("uid", response.data.uid);
                        localStorage.setItem("email", response.data.email);

                        $state.go("adminDashboard");

                    }else{
                        $scope.hideLoding();
                        console.log(response.data);
                        $scope.showAlert("Login Failed !!" , response.data.message);

                    }

                },
                function (error) {
                    console.log(error);
                    $scope.showAlert("Login Failed !!" , "check your email & password or contact support if not resolved ");

                }
            );

        };/////////////dologin ended here////////////////////////////









        ////////////////////loding code startted ///////////////
        $scope.showLoding = function (text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideLoding = function () {
            $ionicLoading.hide();
        };
        $scope.showAlert = function (title, template) {
            $ionicPopup.alert({
                title: title,
                template: template
            });
        };
        ////////////////////loding code ended /////////////////


    }/////controller ended here//////////////////////////

})();








