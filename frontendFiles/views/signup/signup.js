(function() {
    angular.module("signup", [])

        .controller("signupController", ['$scope', signupController]);


        function signupController($scope) {

            $scope.userObject = {};

            $scope.signup = function(){

                console.log($scope.userObject);

            }

        }


})();