(function() {
    angular.module("signup", [])

        .controller("signupController",function ($scope, $http) {

                $scope.userObject = {};

                $scope.signup = function(){

                    $http({
                        method : "post",
                        url : "/v1/signup",
                        data : {
                            // this values are required by api if any one is missing there will be problem
                            email : $scope.userObject.email,
                            password : $scope.userObject.password,
                            firstName : $scope.userObject.firstName,
                            lastName : $scope.userObject.lastName,
                            companyName : $scope.userObject.companyName

                        }
                    });





                }
            }
        );








})();