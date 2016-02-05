/**
 * Created by 205 on 2/2/2016.
 */
/**
 * Created by 205 on 1/28/2016.
 */
(function(){// a self calling function in which adminDashboard module and controller are written

    angular.module("adminDashboard", [])

        .controller("adminDashboardController", ['$scope', '$http','unversalFunctionsService', adminDashboardController]);


    function adminDashboardController($scope,$http,unversalFunctionsService) {

        unversalFunctionsService.isLoggedIn();

        $scope.logout = unversalFunctionsService.clearCredentials;


        $scope.token = localStorage.getItem("token");
        $scope.uid = localStorage.getItem("uid");
        $scope.email = localStorage.getItem("email");




        $http.get("/v1/getCompanyProfile").then(
            function (response) {

                    console.log("response: ",response.data);
                    $scope.profileObject = response.data;
            },
            function (error) {
                console.log("error: ",error);

            }
        );






    }/////controller ended here//////////////////////////

})();//self calling function ended here