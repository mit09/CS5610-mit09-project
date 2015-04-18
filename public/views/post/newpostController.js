var app = angular.module("NewpostApp", ['ngTagsInput','ngMaterial']);
app.controller("NewpostController", function ($scope, $http, $location, $mdToast, $animate, ToastService, UserService) {
    
    /* GLOBAL VARIABLE */
    var allTags = []
    //var allTagsDetailed = []
    var tagPassing = []

    $scope.initialize = function () {
        getAllTags();
        $scope.currentUser = UserService.getCurrentUser();
        $scope.tagpassingscope = tagPassing;
    }
    
    /*Gets all tags required for autocomplete*/
    var getAllTags = function () {
        $http.get("/tags")
        .success(function (response) {
            allTags = response;
            
            /*angular.forEach(response, function (res) {
                allTags.push(res.hashtag);
                allTagsDetailed.push(res);
            });*/
            console.log("allTags array populated for tags autocomplete:: "+allTags);
        });
    }
    

    /* Called when you type in the tag */
    $scope.loadTags = function (query) {
        auto_tags = [];
        
        angular.forEach(allTags, function (tag, index) {
            if(tag.hashtag.match(query)){
                auto_tags.push(tag.hashtag);
            }
        });
        return auto_tags;
    }

    var getTagId = function (allTags, selectedTag) {
        var id;
        angular.forEach(allTags, function (tagDetails) {
           // console.log(tagDetails);
           // console.log(selectedTag);
            if (tagDetails.hashtag == selectedTag.text) {
                id= tagDetails._id;
            }
        });
        //console.log(id);
        return id;
      }
    
    $scope.addPost = function (newpost) {
        
        
        newpost.tags = [];
        
        angular.forEach($scope.selectedTags, function (selectedTag) {
            newpost.tags.push(getTagId(allTags, selectedTag));
        });

     
        newpost.postedBy = $scope.currentUser._id;
        newpost.editedBy = [$scope.currentUser._id]
        
        $http.post("/post", newpost)
        .success(function (response) {
            ToastService.showSimpleToast('New post added');
            // later redirect to view page
            $location.url('/view');
        });
    }

   

    
})