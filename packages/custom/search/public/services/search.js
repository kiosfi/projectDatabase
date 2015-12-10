'use strict';

angular.module('mean.search').factory('Search', ['$resource',
    function ($resource) {
        return $resource('api/search', {},
                {
                    searchProjects: {
                        method: 'GET',
                        isArray: true
                    },
                    searchPayments: {
                        method: 'GET',
                        url: 'api/search/payments',
                        isArray: true
                    },
                    searchAllProjects: {
                        method: 'GET',
                        isArray: true,
                        url: 'api/search/export'
                    },
                    countSearchResults: {
                        method: 'POST',
                        isarray: false,
                        url: 'api/search/count'
                    }
                });
    }
]);

angular.module('mean.search').service('OrgSearch', ['$http',
    function ($http) {
        this.findOrg = function (tag) {
            return $http.get('api/search/org/' + tag);
        }
    }
]);

angular.module('mean.search').service('ThemeSearch', ['$http',
    function ($http) {
        this.findTheme = function (tag) {
            return $http.get('api/search/approved/' + tag);
        }
    }
]);
