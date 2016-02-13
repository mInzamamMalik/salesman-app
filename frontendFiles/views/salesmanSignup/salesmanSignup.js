(function() {
    angular.module("salesmanSignup", [])

        .controller("salesmanSignupController",function ($scope, $http, $state, $ionicLoading, $ionicPopup) {
            $scope.newSalesmanObject = {};

            $scope.salesmanSignup = function () {// when user click on signup this function execute

                $scope.showLoding(); // show loding until signup success or fail


                //  /v1/salesmanSignup will take an object in input like this object
                // {
                //     firstName: String,
                //     lastName: String,
                //     email: { type: String, unique: true, require: true },
                //     password : string
                // }


                $http({ // this line will send signup request to server with an object in request body
                    method: "post",
                    url: "/v1/salesmanSignup",
                    data: {
                        email: $scope.newSalesmanObject.email,
                        password: $scope.newSalesmanObject.password,
                        firstName: $scope.newSalesmanObject.firstName,
                        lastName: $scope.newSalesmanObject.lastName
                    }
                }).then(
                    function (response) { //this function execute on signup response
                        console.log("res: ", response.data);
                        $scope.hideLoding();//hide loading as signup response is arrived


                        if (response.data.signup) { //on signup success
                            $scope.showAlert("Congratulation !!","signed up successfully, please login to continue...");
                            $state.go("login");//route page to login on successful signup

                        } else { //on signup fail
                            $scope.showAlert("Signup Failed !!",response.data.message);
                        }

                    },
                    function (error) {// this function execute when unable to send request
                        console.log("error: ", error);
                        $scope.hideLoding();//hide loding as unable to send loding
                        $scope.showAlert("Unknown Error !!","check you internet connection or check log for technical detail");
                    }
                );
            };


////////////////////loding code startted ///////////////
            $scope.showLoding = function () {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });
            };
            $scope.hideLoding = function () {
                $ionicLoading.hide();
            };
            $scope.showAlert = function(title,template){
                $ionicPopup.alert({
                    title: title,
                    template: template
                });
            };

////////////////////loding code ended /////////////////


        })




})();