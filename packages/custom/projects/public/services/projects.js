'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.projects').factory('Projects', ['$resource',
  function($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
