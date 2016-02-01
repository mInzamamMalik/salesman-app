/**
 * Created by 205 on 1/28/2016.
 */
(function(){

        angular.module("login", [])

            .controller("loginController", ['$scope', loginController]);


            function loginController($scope,$http) {

                $scope.doLogin = function(){
                    $http({
                        method:"post",
                        url : "/v1/login",
                        data : {
                            email : $scope.email,
                            password : $scope.password
                        }
                    }).then(
                        function(response){
                            console.log(response.data);
                        },
                        function(error){
                            console.log(error);

                        }
                    );

                };/////////////dologin ended here////////////////////////////

            }/////controller ended here//////////////////////////

})();