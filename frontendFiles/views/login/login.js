/**
 * Created by 205 on 1/28/2016.
 */
(function(){

        angular.module("login", [])

            .controller("loginController", ['$scope', loginController]);


            function loginController($scope) {
                $scope.name = "inzi";
            }

})();