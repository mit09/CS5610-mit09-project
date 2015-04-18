var app = angular.module("CarpoolApp", []);

app.controller("CarpoolController", function ($scope, $http) {

    $scope.get = function () {
        $http.get('/carpool')
        .success(function (response) {
            $scope.carpools = response
        });
    }

    

    $scope.delete = function (id) {
        $http.delete('/carpool/' + id)
        .success(function (response) {
            $http.get("/carpool")
            .success(function (response2) {
                $scope.carpools = response2;
            });
        });
    }

  
});