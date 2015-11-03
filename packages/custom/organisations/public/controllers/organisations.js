'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', 'Global', 'Organisations', 'MeanUser', 'Circles', 'Projects',
    function ($scope, $stateParams, $location, Global, Organisations, MeanUser, Circles, Projects) {
        $scope.global = Global;



        $scope.hasAuthorization = function (organisation) {
            if (!project)
                return false;
            return MeanUser.isAdmin;
        };

        $scope.find = function () {
            Organisations.query(function (organisations) {
                $scope.organisations = organisations;
            });
        };

        $scope.findOne = function () {
            Organisations.get({
                organisationId: $stateParams.organisationId
            }, function (organisation) {
                $scope.organisation = organisation;
            });
        };

        $scope.findOrgProjects = function () {
//            OrgProjects.get({
//                organisation: $stateParams.organisationId
//            }, function (projects) {
//                console.log(projects);
//                $scope.orgProjects = projects;
//            });
            Projects.query({organisation: $stateParams.organisationId}, function (projects) {
                $scope.orgProjects = [];
                projects.forEach(function (project) {
                    if (project.organisation._id == $stateParams.organisationId) {
                        $scope.orgProjects.push(project);
                    }
                })
            });
        };

    }
]);
