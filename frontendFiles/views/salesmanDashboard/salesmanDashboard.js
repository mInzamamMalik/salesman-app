/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("salesmanDashboard", [])

        .controller("salesmanDashboardController", ['$scope', '$http', 'unversalFunctionsService', '$ionicModal', 'geolocation', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService, $ionicModal, geolocation) {


        var vm = $scope;



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


        //$ionicModal wil call this function
        $scope.placeOrderAsSalesman = function (newOrderObject) {

            geolocation.getLocation().then(function (geoLocation) {

                unversalFunctionsService.showLoading("sending to server...");

                console.log(geoLocation);

                $http({///////////send login request to server with login information in body
                    method: "post",
                    url: "/v1/placeOrder",

                    data: {
                        clientName: newOrderObject.clientName,
                        orderSubject: newOrderObject.orderSubject,
                        orderDetail: newOrderObject.orderDetail,
                        geoCoords: [
                            geoLocation.coords.latitude,
                            geoLocation.coords.longitude
                        ]
                    }

                }).then(
                    function (response) {
                        console.log(response);


                        if ( (response.status / 100) < 4 ) {
                            unversalFunctionsService.hideLoading();
                            $scope.closeModal();
                            vm.getOrderList();//refresh order list
                            //every thing is ok hide loading and modal and do nothing

                        } else {
                            unversalFunctionsService.hideLoading();
                            console.log(response.data);
                            unversalFunctionsService.showAlert(response.statusText, "check logs for more information");
                        }

                    },
                    function (error) {
                        console.log(error);
                        //unversalFunctionsService.showAlert("Login Failed !!", "check your email & password or contact support if not resolved ");

                    }
                );//http req ends here
            },function(geoError){
                unversalFunctionsService.showAlert(geoError,"please allow your browser to get your location or contact admin for more information");
            });//getGeolocation ends here
        };//place order ended here




//////////////get order list as salesman/////////////////////////////////////
        $scope.getOrderList = function () {


                $http.get("/v1/getOrderList").then(
                    function (response) {

                        if ( (response.status / 100) < 4 ) {

                            console.log("response: ", response);
                            $scope.orderList = response.data;//data should be an array

                        } else {
                            console.log(response.data);
                        }


                        //localstorage.setItem("companyUid" , response.data.companyUid);//will save company uid of salesman in local storage
                        //i think this is not secure as salesman can change uid of company and can place order to another company
                    },
                    function (error) {
                        console.log("error getting profile: ", error);

                        if (error.status == 401) {
                            unversalFunctionsService.notLoggedIn();
                        }
                    });

        };//get order list as salesman ended here
        $scope.getOrderList();//get order list as salesman call one time itself





    }/////controller ended here//////////////////////////

})();//self calling function ended here





