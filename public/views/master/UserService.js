var app = angular.module("UserServiceApp", []);

app.factory('UserService', function ($rootScope) {
    
    var currentUser = null;

    var login = function (user) {
        currentUser = user;
    }

    var getCurrentUser = function () {
        return currentUser;
    }

    var logout = function () {
        currentUser = null;
    }
    return {
        /*Expose the function*/
        login: login,
        getCurrentUser: getCurrentUser,
        logout: logout
    };
});