
(function () {

  var app = angular.module('appReddit', ['ionic', 'angularMoment']);

  app.controller('RedditController', function ($scope, $http) {
    $scope.posts = [];
    $http.get('https://www.reddit.com/new/.json')
      .then(function (response) {
        angular.forEach(response.data.data.children, function (element) {
          $scope.posts.push(element);
        });
      });

    $scope.loadNewPosts = function () {
      var params = {};
      if ($scope.posts.lenght > 0) {
        params['after'] = $scope.posts[$scope.posts.lenght - 1].name;
      }
      $http.get('https://www.reddit.com/new/.json', { params: params })
        .then(function (response) {
          angular.forEach(response.data.data.children, function (element) {
            $scope.posts.push(element);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.loadLastPosts = function () {
      var params;
      if ($scope.posts.lenght > 0) {
        params = { 'before': $scope.posts[0].name };
      } else {
        return;
      }
      
      $http.get('https://www.reddit.com/new/.json', { params: params })
        .then(function (response) {
          var newPosts = [];
          angular.forEach(response.data.data.children, function (element) {
            $scope.posts.push(element);
          });
          $scope.posts = newPosts.concat($scope.posts);
          $scope.$broadcast('scroll.refreshComplete');
        });

    };

  });


  app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });




}());