'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', '$window', '$http', 'Global', 'Organisations', 'MeanUser', 'Circles', 'Projects', 'OrgProjects',
    function ($scope, $stateParams, $location, $window, $http, Global, Organisations, MeanUser, Circles, Projects, OrgProjects) {
        $scope.global = Global;

        $scope.organisation = undefined;
        $scope.organisations = [];

        $scope.hasAuthorization = function (organisation) {
            if (!organisation)
                return false;
            return MeanUser.isAdmin;
        };

        $scope.find = function () {
            var ordering  = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page      = $location.search().page;
            if (typeof ordering === 'undefined') {
                ordering = 'name';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.ordering  = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page      = page;
            Organisations.query({
                    ordering:   ordering,
                    ascending:  ascending,
                    page:       page
                },
                function(results) {
                    $scope.organisations = results;
                }
            );
        };

        $scope.findOne = function () {
            Organisations.get({
                organisationId: $stateParams.organisationId
            }, function (organisation) {
                $scope.organisation = organisation;
            });
        };
        /*$scope.findOne = function () {
            // For some unknown reason,
            // $http.get(...).then(success(...), error(...)) doesn't seem to be
            // working here, so we need to use the deprecated
            // $http.get(...).success(...).error(...) instead.
            $http.get('/api/organisations/' + $stateParams.organisationId).success(
                    function (organisation) {
                        $scope.statusCode = 200;
                        $scope.organisation = organisation;
                    }
            ).error(
                    function (error) {
                        $scope.statusCode = error.status;
                        $scope.errorMessage = error.message;
                    }
            );
        };*/

        $scope.confirm = function (organisation) {
            OrgProjects.findProjects(organisation._id).success(function (projects) {
              if (projects.length > 1) {
                if (confirm('Järjestöllä on ' + projects.length + ' hanketta tietokannassa! Haluatko varmasti poistaa järjestön?')) {
                  $scope.remove(organisation);
                }
              } else if (projects.length === 1) {
                if (confirm('Järjestöllä on ' + projects.length + ' hanke tietokannassa! Haluatko varmasti poistaa järjestön?')) {
                  $scope.remove(organisation);
                }
              } else {
                if (confirm('Järjestöllä ei ole hankkeita tietokannassa. Haluatko varmasti poistaa järjestön?')) {
                  $scope.remove(organisation);
                }
              }
          });
        };

        $scope.remove = function (organisation) {
            if (organisation) {
                organisation.$remove(function (response) {
                    for (var i in $scope.organisations) {
                        if ($scope.organisations[i] === organisation) {
                            $scope.organisations.splice(i, 1);
                        }
                    }
                    $location.path('organisations');
                });
            } else {
                $scope.organisation.$remove(function (response) {
                    $location.path('organisations');
                    $window.location.reload();
                });
            }
        };

        $scope.findOrgProjects = function () {
            OrgProjects.findProjects($stateParams.organisationId).success(function (projects) {
                $scope.orgProjects = projects;
            });
        };

        /**
         * The sorting predicate used in organisation listing. Initial value is
         * "name".
         */
        $scope.ordering = 'name';

        /**
         * <tt>true</tt> iff the projects will be listed in ascending order.
         */
        $scope.ascending = 'true';

        /**
         * Current page number.
         */
        $scope.page = 1;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 10;

        /**
         * An array containing JSON objects for pagination.
         */
        $scope.pages;

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} page Number of the page to be displayed.
         */
        $scope.updatePage = function(page) {
            $window.location = '/organisations?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "name").
         */
        $scope.updateOrdering = function(ordering) {
            $window.location = '/organisations?ordering=' + ordering
                    + '&ascending=' + (ordering === $scope.ordering
                            ? !$scope.ascending : true)
                    + '&page=' + $scope.page;
        };

        /**
         * Calculates the number of and links to pages and writes the output to
         * $scope.pages.
         *
         * @returns {undefined}
         */
        $scope.paginate = function() {
            Organisations.countOrganisations(function(result) {
                var pageCount, numberOfPages, pagination;
                pageCount = result.orgCount;
                numberOfPages = Math.ceil(pageCount / $scope.pageSize);
                pagination = document.getElementById('pagination');
                $scope.pages = [];
                for (var i = 1; i <= numberOfPages; ++i) {
                    $scope.pages.push({number: i});
                }
            });
        };
    }
]);
