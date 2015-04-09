var app = angular.module('ViewcarpoolApp', []);

app.controller('viewcarpoolController', function ($scope, $http, UserService) {

    $scope.initialize=function(){
        $scope.reverse = true;
        $scope.orderByProperty = 'createdAt';
        $scope.currentUser = UserService.getCurrentUser();
        getPost();
    }
    $scope.setReverseTrue=function(){
        $scope.reverse = true;
    }

    $scope.setReverseFalse = function () {
        $scope.reverse = false;
    }
   
    

    var getPost = function () {
        $http.get('/carpool')
        .success(function (response) {
            $scope.posts = response
        });
    }

    $scope.deletePost = function (id) {
        $http.delete('/carpool/' + id)
        .success(function (response) {
            getPost();
        });
    }
});