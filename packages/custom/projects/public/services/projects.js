'use strict';
/**
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.projects').factory('Projects', ['$resource',
    function ($resource) {
        return $resource('api/projects/:projectId', {
            projectId: '@_id'
        }, {
            addReview: {
                method: 'PUT', url: 'api/projects/rev/:projectId'
            },
            addRejected: {
                method: 'PUT', url: 'api/projects/rej/:projectId'
            },
            addSigned: {
                method: 'PUT', url: 'api/projects/sign/:projectId'
            },
            addPayment: {
                method: 'PUT', url: '/api/projects/payment/:projectId'
            },
            addEnded: {
                method: 'PUT', url: 'api/projects/end/:projectId'
            },
            addApproved: {
                method: 'PUT', url: 'api/projects/appr/:projectId'
            },
            addEndReport: {
                method: 'PUT', url: 'api/projects/endReport/:projectId'
            },
            addIntReport: {
                method: 'PUT', url: 'api/projects/intReport/:projectId'
            },
            countProjects: {
                method: 'PUT',
                url:    'api/projects'
            },
            getProjects: {
                method: 'GET',
                url:    'api/projects'
            }
        });
    }
]);
