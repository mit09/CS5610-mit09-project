var app = angular.module("TagApp", []);

app.controller("TagController", function ($scope, $http) {
    $scope.selectedIndex = null;

    $scope.addTag = function (tag) {
        $http.post("/tags", tag)
        .success(function (response) {
            $scope.tags = response;
        });
        $scope.clear();
    }

    $scope.getTag = function () {
        $http.get('/tags')
        .success(function (response) {
            $scope.tags = response
        });
    }

    $scope.deleteTag = function (id) {
        $http.delete('/tags/' + id)
        .success(function (response) {
            $scope.tags = response;
        });
    }

    $scope.editTag = function (id) {
        $http.get('/tags/'+ id)
        .success(function(response){
            $scope.tag = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.updateTag = function (tag) {
        $http.put('/tags', $scope.tag)
        .success(function (response) {
            $scope.tags = response;
        });
        $scope.clear();
    }

    $scope.clearTag = function () {
        $scope.tag = null;
        $scope.selectedIndex = null;
    }
});