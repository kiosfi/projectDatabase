'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        /**
         * Fetches project schema attributes to populate search view
         * fields dropdown.
         */
        $scope.getProjectFields = function() {
          $http.get('search/assets/projectFields.json').success(function(response) {
              $scope.projectFields = response.main_menu;
              $scope.dateFields = response.date_fields;
              $scope.stringParams = response.string_params;
              $scope.themes = response.themes;
              $scope.levels = response.levels;
              $scope.states = response.states;
            });
        }

        /**
         * Contains the search results.
         */
        $scope.results;

        /**
         * The search array. Consists of objects having the following three
         * fields: <tt>key</tt> for the name of the key to be searched by,
         * </tt>value</tt> for the value to be matched against, and
         * <tt>type</tt> for distinguishing between literal string matches and
         * regular expressions.
         */
        $scope.searchBy = [];

        /**
         * The sorting predicate used in project listing. Initial value is
         * "project_ref".
         */
        $scope.ordering = 'project_ref';

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
         * Performs the search operation. The parameters are fetched from the
         * URL.
         *
         * @returns {JSON} response from server.
         */
        $scope.search = function () {
            var searchBy        = $location.search().searchBy;
            var ordering        = $location.search().ordering;
            var ascending       = $location.search().ascending;
            var page            = $location.search().page;
            if (typeof searchBy === 'undefined') {
                $scope.results = [];
                return;
            }
            if (typeof ordering === 'undefined') {
                ordering = 'project_ref';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.searchBy     = JSON.parse(searchBy);
            $scope.ordering     = ordering;
            $scope.ascending    = ascending;
            $scope.page         = page;
//            Search.searchProjects($scope.addedQueries, function (searchresults) {
//                $scope.results = searchresults;
//            });
//            var foo = $scope.searchBy.map(function (x) {
//                var bar = {};
//                bar[x.field] = x.value;
//                return JSON.stringify(bar);
//            })
//            console.log(JSON.stringify(foo));
            Search.query({
                "searchBy": searchBy,
                "ordering": ordering,
                "ascending": ascending,
                "page": page
            }, function(results) {
                console.log(results);
                $scope.results = results;
            });
        };

        /**
        * Creates query object from each $scope.field/
        * $scope.value pair
        */
        $scope.addQuery = function () {
          $scope.searchBy.push({});
        };

        $scope.removeQuery = function () {
          $scope.searchBy.splice(-1, 1);
        };

        $scope.update = function () {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        $scope.updatePage = function (page) {
            $window.location = '/search?searchBy=' + $scope.searchBy
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/search?searchBy=' + $scope.searchBy
                    + '&ordering=' + ordering
                    + '&ascending=' + (ordering === $scope.ordering
                            ? !$scope.ascending : true)
                    + '&page=' + $scope.page;
        };

        /**
         * Updates the search criterion and reloads the view.
         *
         * @param {Array} searchBy Array of JSON objects containing key, value
         * and type information.
         */
        $scope.updateCriterion = function (searchBy) {
            $window.location = '/search?searchBy=' + searchBy
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

//        /**
//         * Calculates the number of and links to pages and writes the output to
//         * $scope.pages.
//         *
//         * @returns {undefined}
//         */
//        $scope.paginate = function () {
//            Search.countResults(function (result) {
//                var pageCount, numberOfPages, pagination;
//                pageCount = result.projectCount;
//                numberOfPages = Math.ceil(pageCount / $scope.pageSize);
//                pagination = document.getElementById('pagination');
//                $scope.pages = [];
//                for (var i = 1; i <= numberOfPages; ++i) {
//                    $scope.pages.push({number: i});
//                }
//            });
//        };

    }
]);
