(function() {
    angular.module("salesmanSignup", [])

        .controller("salesmanSignupController",function ($scope, $http, $state, unversalFunctionsService) {
            $scope.newSalesmanObject = {};

            $scope.salesmanSignup = function () {// when user click on signup this function execute

                unversalFunctionsService.showLoading("Signing up..."); // show loding until signup success or fail


                //  /v1/salesmanSignup will take an object in input like this object
                // {
                //     firstName: String,
                //     lastName: String,
                //     email: { type: String, unique: true, require: true },
                //     password : string
                // }


                $http({ // this line will send signup request to server with an object in request body
                    method: "post",
                    url: unversalFunctionsService.url + "/v1/admin/salesmanSignup",
                    data: {
                        email: $scope.newSalesmanObject.email,
                        password: $scope.newSalesmanObject.password,
                        firstName: $scope.newSalesmanObject.firstName,
                        lastName: $scope.newSalesmanObject.lastName
                    }
                }).then(
                    function (response) { //this function execute on signup response
                        console.log("res: ", response.data);
                        unversalFunctionsService.hideLoading();//hide loading as signup response is arrived


                        if (response.data.signup) { //on signup success
                            unversalFunctionsService.showAlert("signed up successfully","salesman can login now");
                            $scope.newSalesmanObject = {};
                            //$state.go("login");//route page to login on successful signup

                        } else { //on signup fail
                            unversalFunctionsService.showAlert("Signup Failed !!",response.data.message);
                        }

                    },
                    function (error) {// this function execute when unable to send request
                        console.log("error: ", error);
                        unversalFunctionsService.hideLoding();//hide loding as unable to send loding
                        unversalFunctionsService.showAlert("Unknown Error !!","check you internet connection or check log for technical detail");
                    }
                );
            };


        })




})();