var app = angular.module('ViewposttagApp', []);

app.controller('viewposttagController', function ($scope, $http, $routeParams, UserService) {
    
    $scope.initialize = function () {
        
        getPostByTag();
        getTagDetails();
        
    }

    
    var getTagDetails = function () {
        
        $http.get('/tags/' + $routeParams.tagId)
        .success(function (response) {
            $scope.tagDetails = response;
            if (UserService.getCurrentUser()) {
                $scope.isFav = isCurrentTagAFav(UserService.getCurrentUser().favorite);
            }
        });
    }

    var getPostByTag = function () {
        var tagId = $routeParams.tagId;
        $http.get('/post/tag/' + tagId)
        .success(function (response) {
            $scope.posts = response;
            
        });
    }

    $scope.fav = function () {
        
        if (!UserService.getCurrentUser()) {
                alert("Please login");
        } else {
            var currentUser = UserService.getCurrentUser();
            currentUser.favorite.push($routeParams.tagId);
            $http.put('/user/one', currentUser)
            .success(function (response) {
                currentUser = response;
                UserService.login(currentUser);
                $scope.isFav = true;
            });
        }
    }

    $scope.unfav = function () {

        if (!UserService.getCurrentUser()) {
            alert("Please login");

        } else {
            var currentUser = UserService.getCurrentUser();
            var index = currentUser.favorite.indexOf($routeParams.tagId);

            if (index == -1) {
                console.log("Tag not in user's fav list")
                return;
            }

            currentUser.favorite.splice(index, 1);
            $http.put('/user/one', currentUser)
            .success(function (response) {
                currentUser = response;
                UserService.login(currentUser);
                $scope.isFav = false;
            });
        }
    }
            


    var isCurrentTagAFav = function (favList) {
        var i;
        for (i = 0; i < favList.length; i++) {
            if (angular.equals(favList[i], $routeParams.tagId)) {
                return true;
            }
        }
        return false;
    }
});
