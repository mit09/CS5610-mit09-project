var app = angular.module("ViewIndividualCarpoolApp", []);

app.controller("ViewIndividualCarpoolController", function ($scope, $http, $routeParams, $window, $location, $sce, UserService) {
   
    var postWithoutDetail;

    $scope.load = function () {
        /* have access to $scope here*/
        console.log("Hello");
    }

    $scope.initialize = function () {
        getpost();
        getpostWihtoutDetails();
        $scope.currentUser = UserService.getCurrentUser();
        

    }

    var updateUrl = function () {
        var key = 'AIzaSyByXKy6Q9yWXBNjjiCC6bXXxZhrcStoGKM';
        $scope.url = 'https://www.google.com/maps/embed/v1/directions?key=' + key + '&origin=' + $scope.post.source + '&destination=' + $scope.post.destination + '  &avoid=tolls|highways';
        $scope.mapurl = $sce.trustAsResourceUrl($scope.url);
    }

    var getpostWihtoutDetails = function () {
        $http.get("/carpool/" + $routeParams.postId)
        .success(function (response) {
            postWithoutDetail = response;
            
        });

    }

    var getpost =function(){
        $http.get("/carpool/detail/" + $routeParams.postId)
        .success(function (response) {
            if (response == null) {
                alert('Post might have been deleted');
                $location.url('/view')
            } else {
                $scope.post = response;
                updateUrl();
            }
            
        });

    }

    $scope.deletePost = function () {
        $http.delete('/carpool/' + $routeParams.postId)
        .success(function (response) {
            $location.url('/view/carpool')
            alert('carpool deleted')
        });
    }

    $scope.close = function () {
        postWithoutDetail.isClose = true;
        $http.put('/carpool/one', postWithoutDetail)
        .success(function (response_inner) {
            $location.url('/view/carpool')
            alert('carpool closed')
        });
    }
    $scope.addComment = function (newcomment) {

        newcomment.commentedBy = UserService.getCurrentUser()._id;

        $http.post('/comment', newcomment)
        .success(function (response) {
            postWithoutDetail.comments.push(response._id);
            $http.put('/carpool/one', postWithoutDetail)
            .success(function (response_inner) {
                postWithoutDetail = response_inner;
                getpost();
                $scope.newcomment.comment = '';
            });
        });
    }
});
