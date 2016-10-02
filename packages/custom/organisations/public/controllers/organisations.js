'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').controller('OrganisationsController', ['$scope', '$stateParams', '$location', '$window', '$http', '$filter', 'Global', 'Organisations', 'MeanUser', 'Circles', 'Projects', 'OrgProjects',
    function ($scope, $stateParams, $location, $window, $http, $filter, Global, Organisations, MeanUser, Circles, Projects, OrgProjects) {
        $scope.global = Global;

        $scope.organisation = undefined;
        $scope.organisations = [];

        /**
         * The property used for sorting the ortanisation's projects in their
         * table.
         */
        $scope.property = "title";

        /**
         * <tt>true</tt> iff the order of projects should be reversed.
         */
        $scope.reverse = false;

        /**
         * Sorts the projects by the given property. If they were previously
         * sorted by the same property, the order will be reversed. This
         * function doesn't alter GET parameters or cause page reload.
         *
         * @param {String} property The property used for sorting
         * @returns {undefined}
         */
        $scope.sortBy = function (property) {
            $scope.reverse = ($scope.property === property) ? !$scope.reverse : false;
            $scope.property = property;
        };

        /**
         * This function converts a number to a Finnish string representation
         * (i.e. ',' for decimal separator and '.' for grouping. If the number
         * is undefined, the string "-" will be returned. Note that this piece
         * of code was copy-pasted from projects controller.
         *
         * @param {Number} number   The number to be converted.
         * @returns {String}        The string representation of that number.
         */
        $scope.numberToString = function (number) {
            if ((typeof number) === "undefined") {
                return "-";
            }
            var string = $filter('currency')(number, '', 2);
            string = string.replace(/,/g, ";");
            string = string.replace(".", ",");
            return string.replace(/;/g, ".");
        };

        $scope.hasAuthorization = function (organisation) {
            if (!organisation)
                return false;
            return MeanUser.isAdmin;
        };

        $scope.find = function () {
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if ((typeof ordering) === 'undefined') {
                ordering = 'name';
            }
            if ((typeof ascending) === 'undefined') {
                ascending = 'true';
            }
            if ((typeof page) === 'undefined') {
                page = 1;
            }
            $scope.ordering = ordering;
            $scope.ascending = ascending === 'true';
            $scope.page = page;
            Organisations.query({
                ordering: ordering,
                ascending: ascending,
                page: page
            },
                    function (results) {
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

        /**
         * Updates organisation's details as per edit-form and goes to org-view
         * if form was valid
         * @param {type} isValid checkes if edit-form is valid
         */
        $scope.update = function (isValid) {
            if (isValid) {
                var organisation = $scope.organisation;
                if (!organisation.updated) {
                    organisation.updated = [];
                }
                organisation.updated.push({time: Date.now(), user: MeanUser.user.name});

                organisation.$update(function () {
                    $location.path('organisations/' + organisation._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

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
                $scope.orgProjects.forEach(function (project) {
                    switch (project.state) {
                        case "päättynyt":
                            project.latestStateDate = project.ended.ended_date
                                    ? project.ended.ended_date
                                    : project.ended.date;
                            break;
                        case "loppuraportti":
                            project.latestStateDate = project.end_report.approved_date 
                                    ? project.end_report.approved_date 
                                    : project.end_report.date;
                            break;
                        case "väliraportti":
                            project.latestStateDate = project.intermediary_reports[
                                    project.intermediary_reports.length - 1].date;
                            break;
                        case "allekirjoitettu":
                            project.latestStateDate = project.signed.signed_date 
                                    ? project.signed.signed_date 
                                    : project.signed.date;
                            break;
                        case "hylätty":
                            project.latestStateDate = project.rejected.date;
                            break;
                        case "hyväksytty":
                            project.latestStateDate = project.approved.approved_date
                                    ? project.approved.approved_date
                                    : project.approved.date;
                            break;
                        case "käsittelyssä":
                            project.latestStateDate = project.in_review.date;
                            break;
                        case "rekisteröity":
                            if (project.date) {
                                project.latestStateDate = project.date;
                            }
                        default:
//                            project.latestStateDate = ObjectId(project._id).getTimestamp();
                    }
                });
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
        $scope.updatePage = function (page) {
            $window.location = '/organisations?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "name").
         */
        $scope.updateOrdering = function (ordering) {
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
        $scope.paginate = function () {
            Organisations.countOrganisations(function (result) {
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
