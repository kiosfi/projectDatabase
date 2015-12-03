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
                $scope.getCsvData();
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
        };

        $scope.getCsvData = function () {
            $scope.parsedData = [];
            angular.forEach($scope.results, function(obj) {
                $scope.parsedData.push({project_ref: obj.project_ref, title: obj.title, coordinator: obj.coordinator,
                organisation: obj.organisation.name, description: obj.description, description_en: obj.description_en,
            duration_months: obj.duration_months,  background: obj.background, gender_aspect: obj.gender_aspect, beneficiaries: obj.beneficiaries,
        project_goal: obj.project_goal, reporting_evalation: obj.reporting_evaluation, sustainability_risks: obj.sustainability_risks,
    other_donors_proposed: obj.other_donors_proposed, region: obj.region, dac: obj.dac, in_review_date: obj.in_review.date, 
    in_review_comments: obj.in_review.comments});
//ended: obj.ended.date
            });
            
        };


    }
]);
