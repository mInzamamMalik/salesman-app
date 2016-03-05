(function() {
    angular.module("signup", [])

        .controller("signupController",function ($scope, $http, $state, unversalFunctionsService) {
            $scope.userObject = {};

            $scope.signup = function () {// when user click on signup this function execute

                unversalFunctionsService.showLoading(); // show loding until signup success or fail


                /*interface patternOfUserObject {

                 email       :    string,
                 password    :    string,
                 firstName   :    string,      //this is a interface which is must required from front end
                 lastName    :    string,
                 companyName :    string

                 }*/


                $http({ // this line will send signup request to server with an object in request body
                    method: "post",
                    url: unversalFunctionsService.url + "/v1/signup",
                    data: {
                        // this values are required by api if any one is missing there will be problem
                        email: $scope.userObject.email,
                        password: $scope.userObject.password,
                        firstName: $scope.userObject.firstName,
                        lastName: $scope.userObject.lastName,
                        companyName: $scope.userObject.companyName

                    }
                }).then(
                    function (response) { //this function execute on signup response
                        console.log("res: ", response.data);
                        unversalFunctionsService.hideLoading();//hide loading as signup response is arrived


                        if (response.data.signup) { //on signup success
                            unversalFunctionsService.showAlert("Congratulation !!","signed up successfully, please login to continue...");
                            $state.go("login");//route page to login on successful signup

                        } else { //on signup fail
                            unversalFunctionsService.showAlert("Signup Failed !!",response.data.message);
                        }

                    },
                    function (error) {// this function execute when unable to send request
                        console.log("error: ", error);
                        unversalFunctionsService.hideLoading();//hide loding as unable to send loding
                        unversalFunctionsService.showAlert("Unknown Error !!","check you internet connection or check log for technical detail");
                    }
                );
            };



        })




})();