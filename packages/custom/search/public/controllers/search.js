'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',

    '$http', '$window', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        $scope.fields = [{"name": "state", "fi": "Tila"}, {"name": "region", "fi": "Alue"},
        {"name": "approved.themes", "fi": "Teemat"}]


        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.states = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty', 'allekirjoitettu', 'väliraportti', 'loppuraportti', 'päättynyt'];

        $scope.addedQueries = [];

        /**
         * Creates search query object
         *
         * @returns {JSON} response from server.
         */
        $scope.search = function () {
            Search.searchProjects($scope.addedQueries, function (searchresults) {
                $scope.results = searchresults;
            });
        };

        /**
        * Creates query object from each $scope.field/
        * $scope.value pair
        */
        $scope.addQuery = function () {
          $scope.addedQueries.push({});
        };

        $scope.removeQuery = function () {
          $scope.addedQueries.splice(-1, 1);
        }


    }
]);
