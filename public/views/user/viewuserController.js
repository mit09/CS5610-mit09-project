var app = angular.module('ViewuserApp', []);

app.controller('viewuserController', function ($scope, $http, $routeParams, $location, UserService) {
    
    var userWithoutDetail;

    $scope.initialize = function () {
        getUserProfile();
        getPostByUser();
        getCarpoolByUser();
        getUserWithoutPopulate();
        $scope.currentUser = UserService.getCurrentUser();
        $scope.orderByProperty = 'createdAt';
        $scope.defaultIcon = '../../images/icons/default.png';

    }

    var getUserWithoutPopulate = function () {

        $http.get('/user/' + $routeParams.userId)
        .success(function (response) {
            $scope.userWithoutDetail = response;
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
    var getCarpoolByUser = function () {
        $http.get('/carpool/user/' + $routeParams.userId)
        .success(function (response) {
            $scope.carpoolposts = response;
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

    $scope.follow = function (userWithoutDetail) {
        
        if (!$scope.currentUser) {
            alert("Please login");
            
        }else{
            userWithoutDetail.follower.push($scope.currentUser._id);
            $http.put('/user/one', userWithoutDetail)
            .success(function (response) {
                $scope.currentUser.following.push(userWithoutDetail._id);
                $http.put('/user/one', $scope.currentUser)
                .success(function (response_inner) {
                    $scope.currentUser = response_inner;
                    UserService.login($scope.currentUser);
                });

                if($scope.userWithoutDetail._id == response._id){
                    $scope.userWithoutDetail = response;
                }
                getUserProfile();
            });
        }
    }

    $scope.unfollow = function () {

        if (!$scope.currentUser) {
            alert("Please login");

        } else {
            var index = $scope.userWithoutDetail.follower.indexOf($scope.currentUser._id);
            if (index == -1) {
                console.log("Couldn't find user in follower list of userprofile while unfollowing.")
                return;
            }
            //console.log(index);
            $scope.userWithoutDetail.follower.splice(index, 1);
            $http.put('/user/one', $scope.userWithoutDetail)
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

    $scope.postCardOnClick = function (id) {        
        $location.url('/view/post/' + id);
    }

    $scope.postCarpoolCardOnClick = function (id) {
        $location.url('/view/carpool/' + id);
    }

    $scope.userclick = function (id) {
        $location.url('/view/user/' + id);
    }
});
