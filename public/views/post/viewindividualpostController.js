var app = angular.module("ViewIndividualPostApp", []);

app.controller("ViewIndividualPostController", function ($scope, $http, $routeParams, $location, UserService) {
   
    var postWithoutDetail;
    $scope.initialize = function () {
        getpost();
        getpostWihtoutDetails();
        $scope.currentUser = UserService.getCurrentUser();

    }

    var getpostWihtoutDetails = function () {
        $http.get("/post/" + $routeParams.postId)
        .success(function (response) {
            if (response == null) {
                alert('Post might have been deleted');
                $location.url('/view')
            } else {
                postWithoutDetail = response;
            }

        });

    }

    var getpost =function(){
        $http.get("/post/detail/" + $routeParams.postId)
        .success(function (response) {
            if (response == null) {
                alert('Post might have been deleted');
                $location.url('/view')
            } else {
                $scope.post = response;
            }
            
        });

    }

    $scope.deletePost = function (id) {
        $http.delete('/post/' + id)
        .success(function (response) {
            $location.url('/view')
            alert('post deleted')
        });
    }

    $scope.addComment = function (newcomment) {

        newcomment.commentedBy = UserService.getCurrentUser()._id;

        $http.post('/comment', newcomment)
        .success(function (response) {
            postWithoutDetail.comments.push(response._id);
            $http.put('/post/one', postWithoutDetail)
            .success(function (response_inner) {
                postWithoutDetail = response_inner;
                getpost();
                $scope.newcomment.comment = '';
            });
        });
    }
});
