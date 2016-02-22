/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("adminDashboard", [])

        .controller("adminDashboardController", ['$scope', '$http', 'unversalFunctionsService', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService, $firebaseObject) {







        //unversalFunctionsService.isLoggedIn();
        $scope.photoUrl = localStorage.getItem("photoUrl");

        $scope.logout = unversalFunctionsService.clearCredentials;


        $scope.token = localStorage.getItem("token");
        $scope.uid = localStorage.getItem("uid");
        $scope.email = localStorage.getItem("email");


        $scope.getCompanyProfile = function () {
            $http.get("/v1/admin/getCompanyProfile").then(
                function (response) {

                    console.log("profile: ", response);
                    $scope.profileObject = response.data;

                    //on response
                    ////////connect to firebase/////////////////////////////////////////
                    var ref = new Firebase("https://sales-man-app.firebaseio.com/").child(response.data.firebaseUid);

                    ref.on("value", function (snapshot) {

                        $scope.profileObject.notificationCount = snapshot.val().notificationCount;

                        console.log("firebase response", $scope.profileObject.notificationCount);
                        $scope.getOrderList();//get order list as salesman call one time itself
                        $scope.$apply();

                    });
                    ////////connect to firebase/////////////////////////////////////////


                },
                function (error) {
                    console.log("error getting profile: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }

                }
            );
        }(); // this function will call it self once on controller load

        $scope.getSalesmanList = function () {
            $http.get("/v1/admin/getSalesmanList").then(
                function (response) {

                    console.log("salesman list: ", response.data);
                    $scope.salesmansList = response.data;

                },
                function (error) {
                    console.log("error getting salesman list: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }

                }
            );
        }(); // this function will call it self once on controller load


        //////////////get order list as salesman/////////////////////////////////////
        $scope.getOrderList = function () {

            $http.get("/v1/admin/getOrderList").then(
                function (response) {

                    if ((response.status / 100) < 4) {

                        console.log("order list as admin: ", response);
                        $scope.orderList = response.data;//data should be an array

                    } else {
                        console.log(response.data);
                    }

                    //localstorage.setItem("companyUid" , response.data.companyUid);//will save company uid of salesman in local storage
                    //i think this is not secure as salesman can change uid of company and can place order to another company
                },
                function (error) {
                    console.log("error getting orders list: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }
                });

        };//get order list as salesman ended here
        $scope.getOrderList();//get order list as salesman call one time itself


    }/////controller ended here//////////////////////////

})();//self calling function ended here