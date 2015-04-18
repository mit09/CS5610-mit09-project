var app = angular.module('homepageApp',[]);

app.controller('homepageController', function ($scope, $location, UserService) {
    $scope.initialize = function () {
        $scope.currentUser = UserService.getCurrentUser();
    }
    $scope.postonclick = function () {
        $location.url('/view');
    }
    $scope.carpoolonclick = function () {
        $location.url('/view/carpool');
    }
});