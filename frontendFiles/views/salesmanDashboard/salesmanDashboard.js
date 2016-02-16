/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("salesmanDashboard", [])

        .controller("salesmanDashboardController", ['$scope', '$http', 'unversalFunctionsService', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService) {

        //unversalFunctionsService.isLoggedIn();
        $scope.photoUrl = localStorage.getItem("photoUrl");

        $scope.logout = unversalFunctionsService.clearCredentials;


        $scope.token = localStorage.getItem("token");
        $scope.uid = localStorage.getItem("uid");
        $scope.email = localStorage.getItem("email");

        //this function call itself one time
        $scope.getSalesmanProfile = function () {
            $http.get("/v1/getSalesmanProfile").then(

                function (response) {
                    console.log("response: ", response);
                    $scope.profileObject = response.data;
                },
                function (error) {
                    console.log("error getting profile: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }
                });
        }();

        //page for this route is not created on server yet
        $scope.placeOrderAsSalesman = function(){
            $http.get("/v1/placeOrderAsSalesman").then(

                function (response) {
                    console.log("response: ", response);
                    $scope.profileObject = response.data;
                },
                function (error) {
                    console.log("error getting profile: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }
                });

        };


    }/////controller ended here//////////////////////////

})();//self calling function ended here