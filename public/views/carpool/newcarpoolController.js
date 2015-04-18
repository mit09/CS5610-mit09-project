var app = angular.module("NewCarppolApp", ['ui.bootstrap', 'ui.bootstrap.datetimepicker']);


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

app.controller("newCarpoolController", function ($scope, $http, $sce, $location, ToastService, UserService) {
   
    $scope.numberOfPassengers = 1;

    $scope.initalize = function () {
        $scope.currentUser = UserService.getCurrentUser();
        initializationForDateTimePicker();
    }
    
    $scope.updateUrl = function () {
        var key = 'AIzaSyByXKy6Q9yWXBNjjiCC6bXXxZhrcStoGKM';
        $scope.url = 'https://www.google.com/maps/embed/v1/directions?key='+ key+ '&origin='+$scope.source+'&destination='+$scope.destination+'  &avoid=tolls|highways';        
        $scope.mapurl = $sce.trustAsResourceUrl($scope.url);
    }

    $scope.addCarpool = function (carpool) {
        
        if (!UserService.getCurrentUser()) {
            ToastService.showSimpleToast("Please login");
        } else {
            carpool.postedBy = UserService.getCurrentUser()._id;
            carpool.date = $scope.seletedDate;
            
            $http.post("/carpool", carpool)
            .success(function (response) {
                ToastService.showSimpleToast('New carpool added');
                $location.url('/view/carpool')
                // later redirect to view page
            });
        }
    }

    var initializationForDateTimePicker = function () {
        $scope.seletedDate = new Date();
        $scope.minDate = new Date();
        $scope.maxDate = new Date();
        $scope.maxDate.setFullYear($scope.minDate.getFullYear() + 1);
        $scope.hourStep = 1;
        $scope.minuteStep = 10;
        $scope.showMeridian = true;
        $scope.showWeeks = false;

    };
});