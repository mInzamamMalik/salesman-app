/**
 * Created by 205 on 2/2/2016.
 */
(function () {// a self calling function in which adminDashboard module and controller are written

    angular.module("salesmanDashboard", [])

        .controller("salesmanDashboardController", ['$scope', '$http', 'unversalFunctionsService', '$ionicModal', adminDashboardController]);


    function adminDashboardController($scope, $http, unversalFunctionsService, $ionicModal) {

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

        //page for this route is created on server but not yet tested
        $scope.placeOrderAsSalesman = function () {
            $http.post("/v1/placeOrderAsSalesman").then(
                function (response) {
                    console.log("response: ", response);
                },
                function (error) {
                    console.log("error in placing order: ", error);

                    if (error.status == 401) {
                        unversalFunctionsService.notLoggedIn();
                    }
                });

        };


        $ionicModal.fromTemplateUrl('./modal-views/placeOrder.html', {

            scope: $scope,
            //animation: 'slide-in-up'
            animation: 'mh-slide'

        }).then(function (modal) {

            $scope.modal = modal;

        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };


    }/////controller ended here//////////////////////////

})();//self calling function ended here





