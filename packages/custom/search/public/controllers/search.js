'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
  '$location', '$window', '$http', 'Global', 'Search', 'MeanUser',
  function($scope, $stateParams, $location, $window, $http, Global, Search, MeanUser) {
    $scope.global = Global;

    /*$scope.package = {
      name: 'search'
    };*/

    $scope.search = function() {

      Search.query({'title':$scope.selected, 'description':$scope.selected, 'description_en': $scope.selected}, function(data) {
        console.log(data);
      });
    };
   /* $scope.search = function() {
      Search.query({tag:$scope.selectedTag}, function(articles) {
        $scope.articles = articles;
      });
    };*/
    /*$scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
      });
    };*/

  }
]);
