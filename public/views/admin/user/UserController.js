var app = angular.module("UserApp", []);

app.controller("UserController", function ($scope, $http) {
    $scope.selectedIndex = null;

    $scope.get = function () {
        $http.get('/user')
        .success(function (response) {
            $scope.users = response
        });
    }

    $scope.add = function (user) {
        $http.post("/user", user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clear();
    }

    

    $scope.delete = function (id) {
        $http.delete('/user/' + id)
        .success(function (response) {
            $scope.users = response;
        });
    }

    $scope.edit = function (id) {
        $http.get('/user/' + id)
        .success(function (response) {
            $scope.user = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.update = function (user) {
        $http.put('/user', $scope.user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clear();
    }

    $scope.clear = function () {
        $scope.user = null;
        $scope.selectedIndex = null;
    }
});