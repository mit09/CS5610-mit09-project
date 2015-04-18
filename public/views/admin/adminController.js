var app = angular.module('adminApp', []);

app.controller('adminController', function ($scope, $http) {

    $scope.isAdminLoggedIn = false;
    $scope.login = function (loginuser) {
        if (loginuser.username != 'admin') {
            alert("Please login as admin");
            return;
        }
        $http.post("/login", loginuser)
        .success(function (response) {
            $scope.isAdminLoggedIn = true;
        })
        .error(function (data, status) {
            if (status == 401) {
                alert('Incorret password')
            }
        });

    }

    $scope.logout = function () {
        $scope.isAdminLoggedIn = false;
    }
    $scope.changeView = function (view) {
        $scope.selectedIndex = null;
        $scope.view = view;
        if (view == 'carpool') {
            getCarpool();
        } else if (view == 'post') {
            getPost()
        } else if (view == 'tag') {
            getTag();
        } else if (view == 'user') {
            getUser();
        }

    }

    var getCarpool = function () {
        $http.get('/carpool')
        .success(function (response) {
            $scope.carpools = response
        });
    }



    $scope.delete = function (id) {
        $http.delete('/carpool/' + id)
        .success(function (response) {
            $http.get("/carpool")
            .success(function (response2) {
                $scope.carpools = response2;
            });
        });
    }


    $scope.selectedIndex = null;

    var getPost = function () {
        $http.get('/post')
        .success(function (response) {
            $scope.posts = response
        });
    }

    $scope.delete = function (id) {
        $http.delete('/post/' + id)
        .success(function (response) {
            $http.get("/post")
            .success(function (response) {
                $scope.posts = response;
            });
        });
    }

    $scope.edit = function (post) {
        $scope.post = post;
        $scope.selectedIndex = post._id;
    }

    $scope.update = function (post) {
        $http.put('/post/one', $scope.post)
        .success(function (response) {
            $http.get("/post")
            .success(function (response) {
                $scope.posts = response;
            });
        });
        $scope.clear();
    }

    $scope.clear = function () {
        $scope.post = null;
        $scope.selectedIndex = null;
    }


    $scope.addTag = function (tag) {
        $http.post("/tags", tag)
        .success(function (response) {
            $scope.tags = response;
        });
        $scope.clearTag();
    }

    var getTag = function () {
        $http.get('/tags')
        .success(function (response) {
            $scope.tags = response
        });
    }

    $scope.deleteTag = function (id) {
        $http.delete('/tags/' + id)
        .success(function (response) {
            $scope.tags = response;
        });
    }

    $scope.editTag = function (id) {
        $http.get('/tags/' + id)
        .success(function (response) {
            $scope.tag = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.updateTag = function (tag) {
        $http.put('/tags', $scope.tag)
        .success(function (response) {
            $scope.tags = response;
        });
        $scope.clearTag();
    }

    $scope.clearTag = function () {
        $scope.tag = null;
        $scope.selectedIndex = null;
    }

    var getUser = function () {
        $http.get('/user')
        .success(function (response) {
            $scope.users = response
        });
    }

    $scope.addUser = function (user) {
        $http.post("/user", user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clearUser();
    }



    $scope.deleteUser = function (id) {
        $http.delete('/user/' + id)
        .success(function (response) {
            $scope.users = response;
        });
    }

    $scope.editUser = function (id) {
        $http.get('/user/' + id)
        .success(function (response) {
            $scope.user = response;
        });
        $scope.selectedIndex = id;
    }

    $scope.updateUser = function (user) {
        $http.put('/user', $scope.user)
        .success(function (response) {
            $scope.users = response;
        });
        $scope.clearUser();
    }

    $scope.clearUser = function () {
        $scope.user = null;
        $scope.selectedIndex = null;
    }
});