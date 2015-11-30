'use strict';

angular.module('mean.search').factory('Search', ['$resource',
  function($resource) {
    return $resource('api/search/', {},
    {
      searchByState: {
        method: 'GET', url: 'api/search/state', isArray: true
      },
      searchByRegion: {
        method: 'GET', url: 'api/search/region', isArray: true
      },
      searchByTitle: {
        method: 'GET', url: 'api/search/title', isArray: true
      }
    });
  }
]);

angular.module('mean.search').service('OrgSearch', ['$http',
    function($http) {
        this.findOrg = function(tag) {
            return $http.get('api/search/org/' + tag);
        }
      }
  ]);

  angular.module('mean.search').service('ThemeSearch', ['$http',
      function($http) {
          this.findTheme = function(tag) {
              return $http.get('api/search/approved/' + tag);
          }
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
