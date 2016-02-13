/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("adminDashboard", [])

        .controller("adminDashboardController", ['$scope', '$http', 'unversalFunctionsService', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService) {

        //unversalFunctionsService.isLoggedIn();
        $scope.photoUrl = localStorage.getItem("photoUrl");

        $scope.logout = unversalFunctionsService.clearCredentials;


        $scope.token = localStorage.getItem("token");
        $scope.uid = localStorage.getItem("uid");
        $scope.email = localStorage.getItem("email");


        $scope.getCompanyProfile = function(){
            $http.get("/v1/getCompanyProfile").then(
                function (response) {

                    console.log("profile: ", response);
                    $scope.profileObject = response.data;

                },
                function (error) {
                    console.log("error getting profile: ", error);

                    if(error.status == 401){
                        unversalFunctionsService.notLoggedIn();
                    }

                }
            );
        }(); // this function will call it self once on controller load

        $scope.getSalesmanList = function(){
            $http.get("/v1/getSalesmanList").then(
                function (response) {

                    console.log("salesman list: ", response.data);
                    $scope.salesmansList = response.data;

                },
                function (error) {
                    console.log("error getting salesman list: ", error);

                    if(error.status == 401){
                        unversalFunctionsService.notLoggedIn();
                    }

                }
            );
        }(); // this function will call it self once on controller load

    }/////controller ended here//////////////////////////

})();//self calling function ended here