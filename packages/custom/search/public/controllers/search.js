'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        $scope.tags = [{"name": "title", "finn": "Nimi"}];
        $scope.fields = ["title"];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.states = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty', 'allekirjoitettu', 'väliraportti', 'loppuraportti', 'päättynyt'];

        /**
         * Contains the search results.
         */
        $scope.results;

        $scope.twoParams = function () {
            var query = {};
            query[$scope.field1] = $scope.param1;
            query[$scope.field2] = $scope.param2;
            console.log(query)
            Search.twoParamsSearch(query, function (searchresults) {
                $scope.results = searchresults;
            });
        };

        $scope.searchByOrgName = function () {
            OrgSearch.findOrg($scope.selectedName).success(function (projects) {
                $scope.results = projects;
            });
        };

        $scope.searchByState = function () {
            Search.searchByState({state: $scope.selectedState}, function (searchresults) {
                $scope.results = searchresults;
            });
        };

        $scope.searchByRegion = function () {
            Search.searchByRegion({region: $scope.selectedRegion}, function (searchresults) {
                $scope.results = searchresults;
            });
        };

        $scope.searchByTheme = function () {
            ThemeSearch.findTheme($scope.selectedTheme).success(function (results) {
                $scope.results = results;
            });
        };
        /* $scope.search = function() {
         Search.query({tag:$scope.selectedTag}, function(articles) {
         $scope.articles = articles;
         });
         };*/
        /*$scope.findOne = function() {
         Projects.get({
         projectId: $stateParams.projectId
         }, function(project) {
         $scope.project = project;
         });
         };*/

        // We need this string to catenate it into the url:
        $scope.searchBy = 'organisation';

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

        // TODO: Fix these three functions:

        /**
         * Updates the page number and reloads the view.
         *
         * @param {String} page Number of the page to be displayed.
         */
        $scope.updatePage = function (page) {
            $window.location = '/search?ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/search?ordering=' + ordering
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
            Projects.countProjects(function (result) {
                var pageCount, numberOfPages, pagination;
                pageCount = result.projectCount;
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
