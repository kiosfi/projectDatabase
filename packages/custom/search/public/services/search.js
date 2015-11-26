'use strict';

angular.module('mean.search').factory('Search', ['$resource',
  function($resource) {
    return $resource('api/search/', {});
    }
  ]);

  /*function($resource) {
    return $resource('projects/:projectId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }*/
