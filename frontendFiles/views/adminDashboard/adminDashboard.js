/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("adminDashboard", [])

        .controller("adminDashboardController", ['$scope', '$http','$ionicModal', 'unversalFunctionsService','NgMap', adminDashboardController]);


    function adminDashboardController($scope, $http,$ionicModal, unversalFunctionsService, NgMap) {







        //unversalFunctionsService.isLoggedIn();
        $scope.photoUrl = localStorage.getItem("photoUrl");

        $scope.logout = unversalFunctionsService.clearCredentials;


        $scope.token = localStorage.getItem("token");
        $scope.uid = localStorage.getItem("uid");
        $scope.email = localStorage.getItem("email");


        $scope.getCompanyProfile = function () {

            $http.get(unversalFunctionsService.url + "/v1/admin/getCompanyProfile").then(
                function (response) {

                    console.log("profile: ", response);
                    $scope.profileObject = response.data;

                    //on response
                    ////////connect to firebase/////////////////////////////////////////
                    ref = new Firebase("https://sales-man-app.firebaseio.com/").child(response.data.firebaseUid).child("notificationCount");

                    ref.on("value", function (snapshot) {

                        $scope.profileObject.notificationCount = snapshot.val();

                        console.log("firebase response", $scope.profileObject.notificationCount);
                        if($scope.profileObject.notificationCount != 0) {
                            $scope.getOrderList();//get order list as salesman call one time itself
                        }
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
            $http.get(unversalFunctionsService.url + "/v1/admin/getSalesmanList").then(
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

            $http.get(unversalFunctionsService.url + "/v1/admin/getOrderList").then(
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


        $scope.deleteOrders = function (arrayOfOrderId) {

            unversalFunctionsService.showConfirm("do you want to delete","",function(){//this function will exe if user click ok

                unversalFunctionsService.showLoading("deleting...");

                $http.post(unversalFunctionsService.url + "/v1/admin/deleteOrders", {arrayOfOrderId: arrayOfOrderId}).then(
                    function (response) {

                        unversalFunctionsService.hideLoading();

                        if(response.data.deleted){
                            $scope.getOrderList();
                        }else{
                            unversalFunctionsService.showAlert("Deleting Error","check logs for more detail")
                        }

                    },
                    function (error) {
                        unversalFunctionsService.hideLoading();
                        console.log("error getting orders list: ", error);

                        if (error.status == 401) {
                            unversalFunctionsService.notLoggedIn();
                        }
                    });
            },function(){//this function will exe if user click cancel


            });

        };//deleteOrders ended here


        $scope.makeAnOrderRead = function(order){
            if(order.unRead ){
                order.unRead = false;

                $http.post("/v1/admin/makeAnOrderRead", order);
            }


        };



        $scope.showOrderDetails = function(order){
            $scope.makeAnOrderRead(order);
            if($scope.profileObject.notificationCount){
                ref.set(0);
            }

            $scope.modal.show();

        }
        $scope.closeModal = function(order){

            $scope.modal.hide();

        }

        $ionicModal.fromTemplateUrl('./views/adminDashboard/modal-views/showOrderDetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });


        $scope.name = "dfghdfg";
        //
        //NgMap.getMap().then(function(map) {
        //    console.log(map.getCenter());
        //    console.log('markers', map.markers);
        //    console.log('shapes', map.shapes);
        //});



    }/////controller ended here//////////////////////////

})();//self calling function ended here