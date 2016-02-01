(function() {
    angular.module("signup", [])

        .controller("signupController",function ($scope, $http, $state, $ionicLoading) {
                $scope.userObject = {};

                $scope.signup = function(){

                    $scope.showLoding();



                    /*interface patternOfUserObject {

                            email       :    string,
                            password    :    string,
                            firstName   :    string,      //this is a interface which is must required from front end
                            lastName    :    string,
                            companyName :    string

                    }*/



                    $http({
                        method : "post",
                        url : "/v1/signup",
                        data : {
                            // this values are required by api if any one is missing there will be problem
                            email : $scope.userObject.email,
                            password : $scope.userObject.password,
                            firstName : $scope.userObject.firstName,
                            lastName : $scope.userObject.lastName,
                            companyName : $scope.userObject.companyName

                        }
                    }).then(
                        function(response){
                            console.log("res: ", response.data);

                            $scope.hideLoding();

                            if(response.data.signup){
                                $state.go("login");
                            }else{
                                alert(response.data.message);
                            }
                        },
                        function(error){
                            console.log("error: ", error);
                        }
                    );
                };




////////////////////loding code startted ///////////////
            $scope.showLoding = function() {
                $ionicLoading.show({
                    template: 'Signing Up...'
                });
            };
            $scope.hideLoding = function(){
                $ionicLoading.hide();
            };

            $scope.showAlert = function(title,template) {
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: template
                });
////////////////////loding code ended /////////////////




            }
        );








})();