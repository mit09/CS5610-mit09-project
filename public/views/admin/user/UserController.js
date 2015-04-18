var app = angular.module("UserApp", []);

app.controller("UserController", function ($scope, $http) {
    $scope.selectedIndex = null;

    $scope.getUser = function () {
        $http.get('/user')
        .success(function (response) {
            $scope.users = response
        });
    }

    $scope.addUser = function (user) {
        $http.post("/user", user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clear();
    }

    

    $scope.deleteUser = function (id) {
        $http.delete('/user/' + id)
        .success(function (response) {
            $scope.users = response;
        });
    }

    $scope.editUser = function (id) {
        $http.get('/user/' + id)
        .success(function (response) {
            $scope.user = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.updateUser = function (user) {
        $http.put('/user', $scope.user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clear();
    }

    $scope.clearUser = function () {
        $scope.user = null;
        $scope.selectedIndex = null;
    }
});