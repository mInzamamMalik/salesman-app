/**
 * Created by 205 on 1/28/2016.
 */
(function(){
        angular.module("home", [])

            .controller("homeController", ['$scope', homeController]);


            function homeController($scope) {
                $scope.name = "inzi";
            }

})();
