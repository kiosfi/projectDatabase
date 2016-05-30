'use strict';
/**
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.projects').factory('Projects', ['$resource',
    function ($resource) {
        return $resource('api/projects/:projectID', {
            projectID: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            addReview: {
                method: 'PUT', url: 'api/projects/rev/:projectID'
            },
            addRejected: {
                method: 'PUT', url: 'api/projects/rej/:projectID'
            },
            addSigned: {
                method: 'PUT', url: 'api/projects/sign/:projectID'
            },
            addPayment: {
                method: 'PUT', url: 'api/projects/payment/:projectID'
            },
            // TODO: Figure out some way to make the appendix functions use
            // these services in order to enable proper access control:
//            addAppendix: {
//                method: 'POST', url: 'api/projects/upload'
//            },
//            accessAppendix: {
//                method: 'GET', url: 'api/projects/data/:projectID'
//            },
            addEnded: {
                method: 'PUT', url: 'api/projects/end/:projectID'
            },
            addApproved: {
                method: 'PUT', url: 'api/projects/appr/:projectID'
            },
            addEndReport: {
                method: 'PUT', url: 'api/projects/endReport/:projectID'
            },
            addIntReport: {
                method: 'PUT', url: 'api/projects/intReport/:projectID'
            },
            createPDF: {
                method: 'GET', url: 'api/projects/pdf/:projectID'
            },
            countProjects: {
                method: 'PUT', url: 'api/projects'
            },
            getProjects: {
                method: 'GET', url: 'api/projects'
            }
        });
    }
]);

angular.module('mean.projects').service('OrgProjects', ['$http',
    function ($http) {
        this.findProjects = function(organisationId) {
            return $http.get('api/projects/byOrg/' + organisationId);
        };
    }
]);
