/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("salesmanDashboard", [])

        .controller("salesmanDashboardController", ['$scope', '$http', 'unversalFunctionsService', '$ionicModal', 'geolocation', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService, $ionicModal, geolocation) {




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

                    //localstorage.setItem("companyUid" , response.data.companyUid);//will save company uid of salesman in local storage
                    //i think this is not secure as salesman can change uid of company and can place order to another company
                },
                function (error) {
                    console.log("error getting profile: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }
                });
        }();

        //$ionicModal wil call this function
        $scope.placeOrderAsSalesman = function (newOrderObject) {

            geolocation.getLocation().then(function (geoLocation) {
                console.log(geoLocation);


                $http({///////////send login request to server with login information in body
                    method: "post",
                    url: "/v1/placeOrderAsSalesman",

                    data: {
                        clientName: newOrderObject.clientName,
                        orderSubject: newOrderObject.orderSubject,
                        orderDetail: newOrderObject.orderDetail,
                        geoCoords: {
                            lat: geoLocation.coords.latitude,
                            long: geoLocation.coords.longitude
                        }
                    }

                }).then(
                    function (response) {
                        console.log(response.data);


                        //if (response.data.logedIn) {
                        //
                        //


                        //
                        //    /*
                        //     disableAnimate: Do not animate the next transition.
                        //     disableBack: The next view should forget its back view, and set it to null.
                        //     historyRoot: The next view should become the root view in its history stack.
                        //     */
                        //
                        //
                        //    if (response.data.isAdmin) { // it means user is loged in
                        //
                        //        unversalFunctionsService.hideLoading();
                        //
                        //        $ionicHistory.nextViewOptions({
                        //            disableBack: true,
                        //            historyRoot: true
                        //        });
                        //        $state.go("adminDashboard", {}, {reload: true});
                        //
                        //    } else if (!response.data.isAdmin) {
                        //        unversalFunctionsService.hideLoading();
                        //
                        //        $ionicHistory.nextViewOptions({
                        //            disableBack: true,
                        //            historyRoot: true
                        //        });
                        //        $state.go("salesmanDashboard", {}, {reload: true});//this dash board is not yet created
                        //    }
                        //
                        //
                        //} else {
                        //    unversalFunctionsService.hideLoading();
                        //    console.log(response.data);
                        //    unversalFunctionsService.showAlert("Login Failed !!", response.data.message);
                        //
                        //}

                    },
                    function (error) {
                        console.log(error);
                        //unversalFunctionsService.showAlert("Login Failed !!", "check your email & password or contact support if not resolved ");

                    }
                );//http req ends here
            });//getGeolocation ends here
        };//place order ended here


        $ionicModal.fromTemplateUrl('./views/salesmanDashboard/modal-views/placeOrder.html', {

            scope: $scope,
            //animation: 'slide-in-up'
            animation: 'mh-slide'

        }).then(function (modal) {

            $scope.modal = modal;

        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };


    }/////controller ended here//////////////////////////

})();//self calling function ended here





