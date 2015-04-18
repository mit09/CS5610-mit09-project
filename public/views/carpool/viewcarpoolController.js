var app = angular.module('ViewcarpoolApp', ['ngMaterial']);

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
})

app.controller('viewcarpoolController', function ($scope, $http, $location, UserService) {

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
   
    $scope.cardOnClick = function (id) {
        $location.url('/view/carpool/' + id);
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