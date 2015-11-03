//Project service used for projects REST endpoint
angular.module('mean.organisations').service('OrgProjects', ['$http',
    function ($http) {
        this.findProjects = function(organisationId) {
            return $http.get('api/projects/byOrg/' + organisationId);
        }
    }
]);
