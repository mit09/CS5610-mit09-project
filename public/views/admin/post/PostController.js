var app = angular.module("PostApp", []);

app.controller("PostController", function ($scope, $http) {
    $scope.selectedIndex = null;

    $scope.get = function () {
        $http.get('/post')
        .success(function (response) {
            $scope.posts = response
        });
    }
    /*
    $scope.add = function (post) {
        $http.post("/post", post)
        .success(function (response) {
            $scope.posts = response;
        });
        $scope.clear();
    }
    */
    

    $scope.delete = function (id) {
        $http.delete('/post/' + id)
        .success(function (response) {
            $http.get("/post")
            .success(function (response) {
                $scope.posts = response;
            });
        });
    }

    $scope.edit = function (post) {
        $scope.post = post;
        $scope.selectedIndex = post._id;
    }

    $scope.update = function (post) {
        $http.put('/post/one', $scope.post)
        .success(function (response) {
            $http.get("/post")
            .success(function (response) {
                $scope.posts = response;
            });
        });
        $scope.clear();
    }

    $scope.clear = function () {
        $scope.post = null;
        $scope.selectedIndex = null;
    }
});