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
    "ToastServiceApp",
    "homepageApp",
]);


masterApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/homepage', {
            templateUrl: 'views/master/homepage.html',
            controller: 'homepageController'
        }).
        when('/login', {
            templateUrl: 'views/master/login.html',
            controller: 'MasterController'
        }).
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
            controller: 'newCarpoolController',
            resolve: {
                loggedin: checkLoggedin
            }
        }).
        when('/view/carpool', {
            templateUrl: 'views/carpool/viewcarpoolfinal.html',
            controller: 'viewcarpoolController'
        }).
        when('/view/tag/:tagId', {
            templateUrl: 'views/post/viewposttag.html',
            controller: 'viewposttagController'
        }).
        when('/view/user/:userId', {
            templateUrl: 'views/user/viewuserfinal.html',
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
            redirectTo: '/homepage'
        });
  }]);

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, ToastService) {
    var deferred = $q.defer();

    $http.get('/loggedin').success(function (user) {
        //$rootScope.errorMessage = null;
        // User is Authenticated
        if (user != '0') {
            console.log('User is authenticated');
            $rootScope.currentUser = user;
            deferred.resolve();
        }
            // User is Not Authenticated
        else {
            console.log('User is not authenticated');
            //$rootScope.errorMessage = 'You need to log in.';
            deferred.reject();
            //$location.url('/login');
            ToastService.showSimpleToast('Please login.')
        }
    });

    return deferred.promise;
};

masterApp.controller("MasterController", function ($scope, $http, $location, $rootScope, ToastService, UserService) {

  
    
    $scope.login = function (user) {
        $http.post("/login", user)
        .success(function (response) {
            UserService.login(response);
            $scope.currentUser = UserService.getCurrentUser();
            $rootScope.cUser = $scope.currentUser;
            console.log('cuser' + $rootScope.cUser);
            var path = $location.path();
            $location.url('/homepage');
            ToastService.showSimpleToast('Welcome ' + user.username);
        })
        .error(function (data, status) {
            if (status == 401) {
                ToastService.showSimpleToast('The password you entered is incorrect. Please try again');
            }
        });
        
    }

    $scope.logout = function () {
        $http.post("/logout")
        .success(function () {
            UserService.logout();
            $scope.currentUser = null;
            $location.url("/homepage");
            
        });
    };

   

    $scope.register = function (user) {
        console.log(user);
        if (user.password != user.password2 || !user.password || !user.password2) {
            ToastService.showSimpleToast("Your passwords don't match");
        }
        else {
            $http.post("/user", user)
            .success(function (response) {
                console.log(response);
                if (response != null) {
                    UserService.login(response);
                    $location.url("/homepage");
                }
            });
        }
    }
});