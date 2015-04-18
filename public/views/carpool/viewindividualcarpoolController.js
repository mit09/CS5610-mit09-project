var app = angular.module("ViewIndividualCarpoolApp", ['ngMaterial']);

app.controller("ViewIndividualCarpoolController", function ($scope, $http, $routeParams, $window, $location, $sce,$mdDialog, ToastService, UserService) {
   
    var postWithoutDetail;

    $scope.load = function () {
        /* have access to $scope here*/
        //console.log("Hello");
    }

    $scope.initialize = function () {
        getpost();
        getpostWihtoutDetails();
        $scope.currentUser = UserService.getCurrentUser();
        $scope.defaultIcon = '../../images/icons/default.png';
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

    var deletePost = function () {
        $http.delete('/carpool/' + $routeParams.postId)
        .success(function (response) {
            $location.url('/view/carpool')
            //alert('carpool deleted')
        });
    }

    var close = function () {
        postWithoutDetail.isClose = true;
        $http.put('/carpool/one', postWithoutDetail)
        .success(function (response_inner) {
            $location.url('/view/carpool')
            //alert('carpool closed')
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

    $scope.confimDelete = function (ev, id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Would you like to delete this carpool?')
          .content('There is no way to recover deleted carpool posts')
          .ariaLabel('Lucky day')
          .ok('Yes')
          .cancel('No')
          .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            deletePost(id);
            ToastService.showSimpleToast('Carpool post deleted');
        }, function () {
            ToastService.showSimpleToast('You have retained this carpool post!');
        });
    };

    $scope.confimClose = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Is the carpool full?')
          .content('')
          .ariaLabel('Lucky day')
          .ok('Yes')
          .cancel('No')
          .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            close();
            ToastService.showSimpleToast('Carpool is full');
        }, function () {
            ToastService.showSimpleToast('This carpool is still open!');
        });
    };
});

var counter = 0;
function abc() {
    counter++
    
    if (counter == 2) {
        document.getElementById('diVLoad').style.display = 'none';
        counter = 0;
    }
    
}