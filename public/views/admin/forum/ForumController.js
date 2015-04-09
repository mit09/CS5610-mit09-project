var app = angular.module("ForumApp", []);

app.controller("ForumController", function ($scope, $http) {
    $scope.selectedIndex = null;

    $scope.addForum = function (forum) {
        $http.post("/forum", forum)
        .success(function (response) {
            $scope.forums = response;
        });
        $scope.clear();
    }

    $scope.getForum = function () {
        $http.get('/forum')
        .success(function (response) {
            $scope.forums = response
        });
    }

    $scope.delete = function (id) {
        $http.delete('/forum/' + id)
        .success(function (response) {
            $scope.forums = response;
        });
    }

    $scope.edit = function (id) {
        $http.get('/forum/' + id)
        .success(function (response) {
            $scope.forum = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.updateForum = function (forum) {
        $http.put('/forum', $scope.forum)
        .success(function (response) {
            $scope.forums = response;
        });
        $scope.clear();
    }

    $scope.clear = function () {
        $scope.forum = null;
        $scope.selectedIndex = null;
    }
});