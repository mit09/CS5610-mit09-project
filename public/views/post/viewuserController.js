var app = angular.module('ViewuserApp', []);

app.controller('viewuserController', function ($scope, $http, $routeParams, UserService) {
    
    var userWithoutDetail;

    $scope.initialize = function () {
        getUserProfile();
        getPostByUser();
        getUserWithoutPopulate();
        $scope.currentUser = UserService.getCurrentUser();

    }

    var getUserWithoutPopulate = function () {

        $http.get('/user/' + $routeParams.userId)
        .success(function (response) {
            userWithoutDetail = response;
        })
    }
        

    var getUserProfile = function () {
        $http.get('/user/detail/' + $routeParams.userId)
        .success(function (response) {
            $scope.userProfile = response;
            //if user logged in 
            if ($scope.currentUser){
                $scope.isFollowing = isCurrentUserAFollower($scope.userProfile.follower);
                $scope.isUserProfileCurrentUser = angular.equals($scope.userProfile._id, $scope.currentUser._id);
            }
        });
    }


    var getPostByUser = function () {
        $http.get('/post/user/' +  $routeParams.userId)
        .success(function (response) {
            $scope.posts = response;
        });
    }
    
    var isCurrentUserAFollower = function (followerList) {
        var i;
        for (i = 0; i < followerList.length; i++) {
            if (angular.equals(followerList[i]._id, $scope.currentUser._id)) {
                return true;
            }
        }
        return false;
    }

    $scope.getIsFollowing = function () {
        console.log($scope.isFollowing);
    }

    $scope.follow = function () {
        
        if (!$scope.currentUser) {
            alert("Please login");
            
        }else{
            userWithoutDetail.follower.push($scope.currentUser._id);
            $http.put('/user/one', userWithoutDetail)
            .success(function (response) {
                $scope.currentUser.following.push($scope.userProfile._id);
                $http.put('/user/one', $scope.currentUser)
                .success(function (response_inner) {
                    $scope.currentUser = response_inner;
                    UserService.login($scope.currentUser);
                });

                userWithoutDetail = response;
                getUserProfile();
            });
        }
    }

    $scope.unfollow = function () {

        if (!$scope.currentUser) {
            alert("Please login");

        } else {
            var index = userWithoutDetail.follower.indexOf($scope.currentUser._id);
            if (index == -1) {
                console.log("Couldn't find user in follower list of userprofile while unfollowing.")
                return;
            }
            //console.log(index);
            userWithoutDetail.follower.splice(index, 1);
            $http.put('/user/one', userWithoutDetail)
            .success(function (response) {
                var index = $scope.currentUser.following.indexOf($scope.userProfile._id);
                if (index == -1) {
                    console.log("Couldn't find user in following list of current user while unfollowing.")
                   return;
                }
                //console.log(index);
                $scope.currentUser.following.splice(index, 1);
                $http.put('/user/one', $scope.currentUser)
                .success(function (response_inner) {
                    $scope.currentUser = response_inner;
                    UserService.login($scope.currentUser);
                });
                userWithoutDetail = response;
                getUserProfile();
            });
        }
    }


});
