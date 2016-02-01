(function() {
    angular.module("signup", [])

        .controller("signupController",function ($scope, $http) {

                $scope.userObject = {};

                $scope.signup = function(){


                    /*interface patternOfUserObject {

                            email       :    string,
                            password    :    string,
                            firstName   :    string,      //this is a interface which is must required from front end
                            lastName    :    string,
                            companyName :    string

                    }*/



                    $http({
                        method : "post",
                        url : "/v1/signup",
                        data : {
                            // this values are required by api if any one is missing there will be problem
                            email : $scope.userObject.email,
                            password : $scope.userObject.password,
                            firstName : $scope.userObject.firstName,
                            companyName : $scope.userObject.companyName

                        }
                    });





                }
            }
        );








})();