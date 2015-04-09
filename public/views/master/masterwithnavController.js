var masterApp = angular.module("MasterApp", [
    "ngRoute",
    "NewpostApp",
    "NewCarppolApp",
    "ViewpostApp",
    "UserServiceApp",
    "ViewposttagApp",
    "ViewuserApp",
    "ViewIndividualPostApp",
    "ViewcarpoolApp",
    "ViewIndividualCarpoolApp",
]);


masterApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/view', {
            templateUrl: 'views/post/viewpost.html',
            controller: 'ViewpostController'
        }).
        when('/register', {
            templateUrl: 'views/master/registration.html',
            controller: 'MasterController'
        }).
        when('/addpost', {
            templateUrl: 'views/post/newpostpartial.html',
            controller: 'NewpostController',
            resolve: {
                loggedin: checkLoggedin
            }
        }).
        when('/addcarpool', {
            templateUrl: 'views/carpool/newcarpoolpartial.html',
            controller: 'newCarpoolController'
        }).
        when('/view/carpool', {
            templateUrl: 'views/carpool/viewcarpool.html',
            controller: 'viewcarpoolController'
        }).
        when('/view/tag/:tagId', {
            templateUrl: 'views/post/viewposttag.html',
            controller: 'viewposttagController'
        }).
        when('/view/user/:userId', {
            templateUrl: 'views/post/viewuser.html',
            controller: 'viewuserController'
        }).
        when('/view/post/:postId', {
            templateUrl: 'views/post/viewindividualpost.html',
            controller: 'ViewIndividualPostController'
        }).
        when('/view/carpool/:postId', {
            templateUrl: 'views/carpool/viewindividualcarpool.html',
            controller: 'ViewIndividualCarpoolController'
        }).
        otherwise({
            redirectTo: '/view'
        });
  }]);

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        // User is Authenticated
        if (user != '0') {
            console.log('User is authenticated');
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is Not Authenticated
        else {
            console.log('User is not authenticated');
            $rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            $location.url('/login');
        }
    });

    return deferred.promise;
};

masterApp.controller("MasterController", function ($scope, $http, $location, $rootScope, UserService) {

    $scope.login = function (user) {
        $http.post("/login", user)
        .success(function (response) {
            UserService.login(response);
            $scope.currentUser = UserService.getCurrentUser();
            var path = $location.path();
            $location.url('/view');
            
        });
    }

    $scope.logout = function () {
        $http.post("/logout")
        .success(function () {
            UserService.logout();
            $scope.currentUser = null;
            $location.url("/view");
        });
    };

   

    $scope.register = function (user) {
        console.log(user);
        if (user.password != user.password2 || !user.password || !user.password2) {
            $rootScope.message = "Your passwords don't match";
        }
        else {
            $http.post("/user", user)
            .success(function (response) {
                console.log(response);
                if (response != null) {
                    UserService.login(response);
                    $location.url("/view");
                }
            });
        }
    }
});