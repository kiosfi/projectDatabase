'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        $scope.tags = ['Järjestö', 'Tila', 'Maanosa tai maa', 'Teema'];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.results = [];
        $scope.states = function () {
            $http.get('api/states').success(function (states) {
                $scope.states = states;
            });
        };

        $scope.searchByOrgName = function () {
            OrgSearch.findOrg($scope.selectedName).success(function (projects) {
                $scope.searchresults = projects;
            });
        };

        $scope.searchByState = function () {
            Search.searchByState({state: $scope.selectedState}, function (searchresults) {
                $scope.searchresults = searchresults
            });
        };

        $scope.searchByRegion = function () {
            Search.searchByRegion({region: $scope.selectedRegion}, function (searchresults) {
                $scope.searchresults = searchresults;
            });
        };

        $scope.searchByTheme = function () {
            ThemeSearch.findTheme($scope.selectedTheme).success(function (results) {
                $scope.searchresults = results;
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

    }
]);
