'use strict';

/**
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.projects').factory('Projects', ['$resource',
  function($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      addReview: {
        method: 'PUT', url: 'api/projects/rev/:projectId'
      },
      addRejected: {
        method: 'PUT', url: 'api/projects/rej/:projectId'
      }
    });
  }
]);
