var app = angular.module("ViewIndividualPostApp", []);

app.controller("ViewIndividualPostController", function ($scope, $http, $routeParams, $location, $mdDialog, ToastService, UserService) {
   
    var postWithoutDetail;
    $scope.initialize = function () {
        getpost();
        getpostWihtoutDetails();
        $scope.currentUser = UserService.getCurrentUser();
        $scope.defaultIcon = '../../images/icons/default.png';
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

    var deletePost = function (id) {
        $http.delete('/post/' + id)
        .success(function (response) {
            $location.url('/view')
            
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
                ToastService.showSimpleToast('New comment posted');
            });
        });
    }

    $scope.showConfirm = function (ev, id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Would you like to delete this post?')
          .content('There is no way to recover deleted posts')
          .ariaLabel('Lucky day')
          .ok('Yes')
          .cancel('No')
          .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            deletePost(id);
            ToastService.showSimpleToast('Post has been deleted');
        }, function () {
            ToastService.showSimpleToast('You have retained the post!');
        });
    };

    /*$scope.showActionToast = function (id) {

        var toastPosition = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        var toastPos = Object.keys(toastPosition)
         .filter(function (pos) { return toastPosition[pos]; })
         .join(' ');

        var toast = $mdToast.simple()
              .content('Action Toast!')
              .action('OK')
              .highlightAction(false)
              .position(toastPos, false, true);

        $mdToast.show(toast).then(function () {
            deletePost(id)
        });
    }*/
});
