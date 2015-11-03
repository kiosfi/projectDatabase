'use strict';

angular.module('mean.statechanges').factory('Statechanges', ['$resource',
  function($resource) {
    return $resource('api/states/current_state', {
      current_state: '@current_state'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
