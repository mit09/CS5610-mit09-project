var app = angular.module("NewCarppolApp", []);


app.directive('googleplace', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0],
                    options);

            google.maps.event.addListener(scope.gPlace, 'place_changed',
                    function () {
                        scope.$apply(function () {
                            model.$setViewValue(element.val());
                        });
                    });
        }
    };
});

app.controller("newCarpoolController", function ($scope, $http, $sce, $location, UserService) {
   
    $scope.numberOfPassengers = 1;

    $scope.initalize = function () {
        $scope.currentUser = UserService.getCurrentUser();
    }
    
    $scope.updateUrl = function () {
        var key = 'AIzaSyByXKy6Q9yWXBNjjiCC6bXXxZhrcStoGKM';
        $scope.url = 'https://www.google.com/maps/embed/v1/directions?key='+ key+ '&origin='+$scope.source+'&destination='+$scope.destination+'  &avoid=tolls|highways';        
        $scope.mapurl = $sce.trustAsResourceUrl($scope.url);
    }

    $scope.addCarpool = function (carpool) {

        if (!UserService.getCurrentUser()) {
            alert("Please login");

        } else {
            carpool.postedBy = UserService.getCurrentUser()._id;
            $http.post("/carpool", carpool)
            .success(function (response) {
                alert("added carpool");
                $location.url('/view/carpool')
                // later redirect to view page
            });
        }
    }
});