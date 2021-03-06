﻿var app = angular.module('ViewpostApp', ['ngMdIcons']);

app.controller('ViewpostController', function ($scope, $http, $location, UserService) {

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
        $location.url('/view/post/'+id);
    }

    var getPost = function () {
        $http.get('/post')
        .success(function (response) {
            $scope.posts = response
        });
    }

    $scope.deletePost = function (id) {
        $http.delete('/post/' + id)
        .success(function (response) {
            getPost();
        });
    }
});