(function() {
    angular.module("signup", [])

        .controller("signupController", ['$scope', signupController])


        function signupController($scope) {
            $scope.name = "inzi";
        };


})();